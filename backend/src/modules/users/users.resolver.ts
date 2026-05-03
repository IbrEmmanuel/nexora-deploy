import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver('User')
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => String, { name: 'me' })
  async me(@CurrentUser('id') userId: string): Promise<string> {
    const user = await this.usersService.findById(userId);
    return JSON.stringify(user);
  }

  @Query(() => String, { name: 'user' })
  async user(@Args('id', { type: () => ID }) id: string): Promise<string> {
    const user = await this.usersService.findById(id);
    return JSON.stringify(user);
  }

  @Mutation(() => String, { name: 'updateUser' })
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserDto,
    @CurrentUser('id') requesterId: string,
  ): Promise<string> {
    const user = await this.usersService.update(id, input, requesterId);
    return JSON.stringify(user);
  }
}
