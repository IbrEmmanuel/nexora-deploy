import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Mutation(() => String, { name: 'aiChat' })
  async aiChat(
    @Args('message') message: string,
    @CurrentUser('organizationId') organizationId: string,
  ): Promise<string> {
    const result = await this.aiService.chat(
      [{ role: 'user', content: message }],
      organizationId,
    );
    return result.answer;
  }
}
