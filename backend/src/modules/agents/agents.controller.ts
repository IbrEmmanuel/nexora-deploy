import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService, CreateAgentDto } from './agents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all agents for organization' })
  getAgents(@CurrentUser('organizationId') orgId: string) {
    return this.agentsService.getAgents(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new AI agent' })
  createAgent(
    @Body() dto: Omit<CreateAgentDto, 'organizationId'>,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.agentsService.createAgent({ ...dto, organizationId: orgId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  getAgent(@Param('id') id: string) {
    return this.agentsService.getAgent(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update agent status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'active' | 'idle' | 'paused' | 'learning',
  ) {
    return this.agentsService.updateAgentStatus(id, status);
  }

  @Post(':id/chat')
  @ApiOperation({ summary: 'Chat with an agent' })
  chat(
    @Param('id') id: string,
    @Body('message') message: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.agentsService.chat(id, message, orgId);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a task via agent' })
  executeTask(
    @Param('id') agentId: string,
    @Body() body: { taskType: string; payload: Record<string, unknown> },
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.agentsService.executeTask({
      agentId,
      taskType: body.taskType,
      payload: body.payload,
      organizationId: orgId,
    });
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get agent task logs' })
  getLogs(@Param('id') id: string) {
    return this.agentsService.getTaskLogs(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  deleteAgent(@Param('id') id: string) {
    return this.agentsService.deleteAgent(id);
  }
}
