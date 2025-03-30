import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationInfoService } from './reservation-info.service';
import { ReservationInfoEntity, UserEntity } from '@libs/shared';
import {
	AddReservationInfoInput,
	FindReservationInfoArgs,
	UpdateReservationInfoInput,
} from './reservation-info.schema';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { GqlUser } from '@libs/shared/decorators/gql-user.decorator';

@Resolver()
export class ReservationInfoResolver {
	constructor(private readonly service: ReservationInfoService) {}

	@Query(() => [ReservationInfoEntity], {
		name: 'reservations',
		description: '获取所有预约信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async listReservations(@Args() args: FindReservationInfoArgs) {
		return await this.service.listReservations(args);
	}

	@Query(() => [ReservationInfoEntity], {
		name: 'reservationsByCurrentUser',
		description: '获取当前用户所有预约信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async listReservationsByUserId(
		@GqlUser() user: UserEntity,
		@Args() args: FindReservationInfoArgs,
	) {
		return await this.service.listReservations(args, user);
	}

	@Mutation(() => ReservationInfoEntity, {
		description: '新增预约信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async addReservationInfo(
		@GqlUser() user: UserEntity,
		@Args('data') data: AddReservationInfoInput,
	): Promise<ReservationInfoEntity> {
		return await this.service.addReservationInfo(user, data);
	}

	@Query(() => ReservationInfoEntity, {
		name: 'reservationInfo',
		description: '获取预约信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async getReservationInfo(@Args('id') id: string): Promise<ReservationInfoEntity> {
		return await this.service.getReservationInfo(id);
	}

	@Mutation(() => ReservationInfoEntity, {
		description: '修改预约信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async updateReservationInfo(
		@GqlUser() user: UserEntity,
		@Args('data') data: UpdateReservationInfoInput,
	): Promise<ReservationInfoEntity> {
		return await this.service.updateReservationInfo(user, data);
	}
}
