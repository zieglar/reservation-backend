import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '@libs/shared';

export const GqlUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const context = GqlExecutionContext.create(ctx).getContext();
	return context.req.user as UserEntity;
});
