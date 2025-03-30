import { SimpleTableInfo } from '@libs/shared/entities/table-info.entity';
import { FullBaseEntity } from '@libs/shared/entities/base.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReservationStatus } from '@libs/shared/schemas';
import { SimpleContactInfo } from '@libs/shared/entities/contact-info.entity';

@ObjectType({ description: '预约信息' })
export class ReservationInfoEntity extends FullBaseEntity {
	@Field(() => String, { description: '联系人ID' })
	contactId: string;

	@Field(() => String, { description: '餐桌ID' })
	tableId: string;

	@Field(() => String, { description: '用户ID' })
	userId: string;

	@Field(() => String, { description: '预约时间' })
	date: string;

	@Field(() => String, { description: '预定人数' })
	numberOfPeople: number;

	@Field(() => Int, { description: '预约状态' })
	status: ReservationStatus;

	@Field(type => SimpleContactInfo, { description: '联系人信息' })
	contact?: SimpleContactInfo;

	@Field(type => SimpleTableInfo, { description: '餐桌信息' })
	table?: SimpleTableInfo;

	@Field(() => String, { description: '最后操作人ID', nullable: true })
	lastOperatorId?: string;
}
