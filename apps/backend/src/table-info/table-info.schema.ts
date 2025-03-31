import { Field, InputType, Int } from '@nestjs/graphql';
import { Allow } from 'class-validator';

@InputType({ description: '餐桌信息' })
export class TableInfoInput {
	@Field(() => Int, { description: '餐桌座位数' })
	@Allow()
	seats: number;
}
