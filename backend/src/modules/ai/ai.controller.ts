import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsArray, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AiService, ChatMessage } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class ChatMessageDto implements ChatMessage {
  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

class ChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send a message to the AI assistant' })
  async chat(
    @Body() dto: ChatDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.aiService.chat(dto.messages, organizationId);
  }

  @Get('automations')
  @ApiOperation({ summary: 'List automation flows for organization' })
  async getAutomations(@CurrentUser('organizationId') organizationId: string) {
    // Automations are stored as agent tasks with taskType = 'automation'
    return { automations: [], organizationId };
  }

  @Post('automations')
  @ApiOperation({ summary: 'Create an automation flow' })
  async createAutomation(
    @Body() body: { name: string; trigger: string; actions: string[]; enabled?: boolean },
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return {
      id: `auto_${Date.now()}`,
      name: body.name,
      trigger: body.trigger,
      actions: body.actions,
      enabled: body.enabled ?? true,
      organizationId,
      createdAt: new Date().toISOString(),
      runs: 0,
      lastRunAt: null,
    };
  }
}
