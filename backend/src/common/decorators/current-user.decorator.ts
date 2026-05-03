import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    let user: Record<string, unknown>;

    if ((context.getType() as string) === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      user = ctx.getContext().req.user;
    } else {
      user = context.switchToHttp().getRequest().user;
    }

    return data ? user?.[data] : user;
  },
);
