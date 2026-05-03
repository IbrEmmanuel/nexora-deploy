import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => String, { description: 'Refresh access token via GraphQL' })
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<string> {
    const tokens = await this.authService.refreshTokens(refreshToken);
    return tokens.accessToken;
  }
}
