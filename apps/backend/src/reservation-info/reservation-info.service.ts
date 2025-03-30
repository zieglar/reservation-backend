import { Injectable } from '@nestjs/common';
import { IDataService } from '@libs/core/base/data.service';
import {
	AddReservationInfoInput,
	FindReservationInfoArgs,
	UpdateReservationInfoInput,
} from './reservation-info.schema';
import { ReservationInfoEntity, ReservationStatus, ROLE_USER, UserEntity } from '@libs/shared';
import { LogicalWhereExpr } from 'ottoman/lib/types/query';
import { has } from 'utility';

@Injectable()
export class ReservationInfoService {
	constructor(private readonly dbService: IDataService) {} // Replace 'any' with the actual type of your repository

	async listReservations(args: FindReservationInfoArgs, user?: UserEntity) {
		const { keyword, date, status, seats, page, limit } = args;
		const filter: LogicalWhereExpr<ReservationInfoEntity> = { $and: [] };
		if (user && user.role === ROLE_USER) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			filter.$and.push({ userId: user.id });
		}
		if (date) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			filter.$and.push({ date });
		}
		if (status) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			filter.$and.push({ status });
		}
		if (seats) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			filter.$and.push({ 'table.seats': seats });
		}
		if (keyword) {
			const like = `%${keyword}%`;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			filter.$and.push({
				$or: [{ 'contact.name': { $like: like } }, { 'contact.phone': { $like: like } }],
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (filter.$and.length === 0) {
			delete filter.$and;
		}

		return await this.dbService.reservations.find(filter, {
			sort: { date: 'DESC', createdAt: 'ASC' },
			limit: limit,
			skip: (page - 1) * limit,
		});
	}

	async addReservationInfo(
		user: UserEntity,
		data: AddReservationInfoInput,
	): Promise<ReservationInfoEntity> {
		const table = await this.dbService.tables.findOne(
			{
				seats: {
					$gte: data.numberOfPeople,
				},
			},
			{ sort: { seats: 'ASC' } },
		);
		if (!table) {
			throw new Error('没有符合可用人数的餐桌');
		}

		let contact = await this.dbService.contacts.findOne({
			phone: data.phone,
		});

		if (!contact) {
			contact = await this.dbService.contacts.create({
				name: data.name,
				phone: data.phone,
				userId: user.id,
			});
		}

		return await this.dbService.reservations.create({
			date: data.date,
			numberOfPeople: data.numberOfPeople,
			table: { seats: table.seats },
			contact: { name: data.name, phone: data.phone },
			tableId: table.id,
			contactId: contact.id,
			status: ReservationStatus.Requested,
			userId: user.id,
		});
	}

	async updateReservationInfo(
		user: UserEntity,
		{ id, name, phone, ...data }: UpdateReservationInfoInput,
	) {
		const reservation = await this.dbService.reservations.findOne(
			{
				id,
			},
			{ lean: true },
		);

		if (!reservation) {
			throw new Error('没有找到预约信息');
		}

		if (user.role === ROLE_USER && data.status !== reservation.status && data.status !== 3) {
			throw new Error('用户只能取消预约');
		}

		const newData: Partial<ReservationInfoEntity> = {
			...data,
			lastOperatorId: user.id,
		};

		if (!has(data, 'status') && data.numberOfPeople !== reservation.numberOfPeople) {
			const table = await this.dbService.tables.findOne({
				seats: {
					$gte: data.numberOfPeople,
				},
			});
			if (!table) {
				throw new Error('没有符合可用人数的餐桌');
			}
			newData.table = { seats: table.seats };
			newData.tableId = table.id;
		}
		if (name && phone) {
			newData.contact = { name, phone };
		}

		return await this.dbService.reservations.updateOneById(id, newData);
	}

	async getReservationInfo(id: string) {
		const reservation = await this.dbService.reservations.findOne(
			{
				id,
			},
			{ lean: true },
		);

		if (!reservation) {
			throw new Error('没有找到预约信息');
		}

		return reservation;
	}
}
