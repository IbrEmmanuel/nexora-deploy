import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CreateAgentDto {
  name: string;
  role: 'SALES' | 'SUPPORT' | 'OPERATIONS' | 'FINANCE' | 'EMAIL' | 'CUSTOM';
  capabilities: string[];
  systemPrompt?: string;
  organizationId: string;
}

export interface AgentTask {
  agentId: string;
  taskType: string;
  payload: Record<string, unknown>;
  organizationId: string;
}

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  // In-memory agent store (replace with DB in production)
  private agents: Map<string, Record<string, unknown>> = new Map();
  private taskLogs: Map<string, unknown[]> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('agent-tasks') private readonly taskQueue: Queue,
  ) {}

  async createAgent(dto: CreateAgentDto) {
    const id = `agent_${Date.now()}`;
    const agent = {
      id,
      ...dto,
      status: 'idle',
      tasksCompleted: 0,
      successRate: 100,
      createdAt: new Date(),
      lastActiveAt: null,
    };
    this.agents.set(id, agent);
    this.logger.log(`Agent created: ${dto.name} (${dto.role})`);
    return agent;
  }

  async getAgents(organizationId: string) {
    return Array.from(this.agents.values()).filter(
      (a: any) => a.organizationId === organizationId,
    );
  }

  async getAgent(id: string) {
    const agent = this.agents.get(id);
    if (!agent) throw new NotFoundException(`Agent ${id} not found`);
    return agent;
  }

  async updateAgentStatus(id: string, status: 'active' | 'idle' | 'paused' | 'learning') {
    const agent = await this.getAgent(id);
    const updated = { ...agent, status, updatedAt: new Date() };
    this.agents.set(id, updated);
    this.eventEmitter.emit('agent.status.changed', { agentId: id, status });
    return updated;
  }

  async executeTask(task: AgentTask) {
    const agent = await this.getAgent(task.agentId);
    await this.updateAgentStatus(task.agentId, 'active');

    try {
      // Queue the task for async processing
      const job = await this.taskQueue.add('execute', task, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      });

      this.logger.log(`Task queued for agent ${task.agentId}: job ${job.id}`);
      return { jobId: job.id, status: 'queued' };
    } catch (error) {
      await this.updateAgentStatus(task.agentId, 'idle');
      throw error;
    }
  }

  async chat(agentId: string, message: string, organizationId: string) {
    const agent: any = await this.getAgent(agentId);

    const systemPrompt = agent.systemPrompt ||
      `You are ${agent.name}, an AI agent specialized in ${agent.role}. 
       Your capabilities include: ${agent.capabilities?.join(', ')}.
       Be concise, professional, and action-oriented.`;

    const result = await this.aiService.chat(
      [{ role: 'user', content: message }],
      organizationId,
      { temperature: 0.7 },
    );

    // Log the interaction
    const logs = this.taskLogs.get(agentId) ?? [];
    logs.push({
      type: 'chat',
      message,
      response: result.answer,
      timestamp: new Date(),
      tokensUsed: result.tokensUsed,
    });
    this.taskLogs.set(agentId, logs.slice(-100)); // Keep last 100

    return { response: result.answer, tokensUsed: result.tokensUsed };
  }

  async getTaskLogs(agentId: string) {
    return this.taskLogs.get(agentId) ?? [];
  }

  async deleteAgent(id: string) {
    const agent = await this.getAgent(id);
    this.agents.delete(id);
    this.taskLogs.delete(id);
    return { deleted: true, id };
  }
}
