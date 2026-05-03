import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiQueryResult {
  answer: string;
  tokensUsed: number;
  model: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(
    messages: ChatMessage[],
    organizationId: string,
    options: { model?: string; maxTokens?: number; temperature?: number } = {},
  ): Promise<AiQueryResult> {
    const model = options.model ?? this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
    const maxTokens = options.maxTokens ?? this.configService.get<number>('OPENAI_MAX_TOKENS', 4096);
    const temperature = options.temperature ?? this.configService.get<number>('OPENAI_TEMPERATURE', 0.7);

    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are NexoraGrid AI, an intelligent business assistant. You help users analyze data, generate reports, and optimize their business operations. Be concise, accurate, and actionable. Organization ID: ${organizationId}`,
    };

    const response = await this.openai.chat.completions.create({
      model,
      messages: [systemMessage, ...messages],
      max_tokens: maxTokens,
      temperature,
    });

    const choice = response.choices[0];
    const answer = choice.message.content ?? '';
    const tokensUsed = response.usage?.total_tokens ?? 0;

    this.logger.log(`AI query completed: ${tokensUsed} tokens used`);

    return { answer, tokensUsed, model };
  }

  async generateInsights(data: Record<string, unknown>, organizationId: string): Promise<string> {
    const result = await this.chat(
      [
        {
          role: 'user',
          content: `Analyze this business data and provide 3 key insights with actionable recommendations:\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
      organizationId,
      { temperature: 0.5 },
    );

    return result.answer;
  }

  async generateReport(
    reportType: string,
    data: Record<string, unknown>,
    organizationId: string,
  ): Promise<string> {
    const result = await this.chat(
      [
        {
          role: 'user',
          content: `Generate a professional ${reportType} report based on this data. Include executive summary, key findings, and recommendations:\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
      organizationId,
      { temperature: 0.3, maxTokens: 2048 },
    );

    return result.answer;
  }
}
