import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Allow } from 'class-validator';

@ArgsType()
export class PaginationArgs {
	@Field(() => Int)
	@Allow()
	page: number = 1;

	@Field(() => Int)
	@Allow()
	limit: number = 10;
}
