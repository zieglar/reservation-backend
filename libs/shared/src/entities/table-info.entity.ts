import { IdBaseEntity } from '@libs/shared/entities/base.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '餐桌信息' })
export class TableInfoEntity extends IdBaseEntity {
	@Field(() => Int, { description: '可坐人数' })
	seats: number;
}

@ObjectType({ description: '简单餐桌信息' })
export class SimpleTableInfo {
	@Field(() => Int, { description: '可坐人数' })
	seats: number;
}
