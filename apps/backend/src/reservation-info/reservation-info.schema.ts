import { ArgsType, Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ReservationStatus } from '@libs/shared';
import { PaginationArgs } from '../common/base.schema';
import { Allow, IsIn, ValidateIf } from 'class-validator';

@InputType({ description: '新增预约信息' })
export class AddReservationInfoInput {
	@Field(() => String, { description: '预约日期' })
	@Allow()
	date: string;

	@Field(() => Int, { description: '预约人数' })
	@Allow()
	numberOfPeople: number;

	@Field(() => String, { description: '预约人姓名' })
	@Allow()
	name: string;

	@Field(() => String, { description: '预约人手机号' })
	@Allow()
	phone: string;
}

registerEnumType(ReservationStatus, {
	name: 'ReservationStatus',
	description: '预约状态',
	valuesMap: {
		Requested: {
			description: '已预约',
		},
		Approved: {
			description: '已确认',
		},
		Cancelled: {
			description: '已取消',
		},
		Completed: {
			description: '已完成',
		},
	},
});

@InputType({ description: '修改预约信息状态' })
export class UpdateReservationInfoInput {
	@Field(() => String, { description: '预约信息ID' })
	@Allow()
	id: string;

	@Field(() => Int, { description: '预约状态', nullable: true })
	@Allow()
	@ValidateIf((_, val) => val !== null && val !== undefined)
	@IsIn([2, 3, 4])
	status?: number;

	@Field(() => String, { description: '预约日期', nullable: true })
	@Allow()
	date: string;

	@Field(() => Int, { description: '预约人数', nullable: true })
	@Allow()
	numberOfPeople: number;

	@Field(() => String, { description: '预约人姓名', nullable: true })
	@Allow()
	name: string;

	@Field(() => String, { description: '预约人手机号', nullable: true })
	@Allow()
	phone: string;
}

@ArgsType()
export class FindReservationInfoArgs extends PaginationArgs {
	@Field(() => String, { description: '预约相关信息:预约人姓名/预约电话', nullable: true })
	@Allow()
	keyword?: string;

	@Field(() => String, { description: '预约日期', nullable: true })
	@Allow()
	date?: string;

	@Field(() => Int, { description: '预约状态', nullable: true })
	@Allow()
	status?: number;

	@Field(() => Int, { description: '餐桌人数', nullable: true })
	@Allow()
	seats?: number;
}
