import { Test, TestingModule } from '@nestjs/testing';
import { ReservationInfoService } from './reservation-info.service';
import { IDataService } from '@libs/core/base/data.service';
import {
	AddReservationInfoInput,
	FindReservationInfoArgs,
	UpdateReservationInfoInput,
} from './reservation-info.schema';
import {
	ContactInfoEntity,
	ReservationInfoEntity,
	ReservationStatus,
	UserEntity,
} from '@libs/shared';

describe('ReservationInfoService', () => {
	let service: ReservationInfoService;
	let dbService: jest.Mocked<IDataService>;
	let user: UserEntity;

	const mockReservation: ReservationInfoEntity = {
		id: '1',
		date: '2023-01-01',
		numberOfPeople: 4,
		table: { seats: 4 },
		contact: { name: 'John Doe', phone: '1234567890' },
		tableId: 'table1',
		contactId: 'contact1',
		userId: 'user1',
		status: ReservationStatus.Requested,
		createdAt: new Date('2023-01-01'),
		updatedAt: new Date('2023-01-01'),
	};

	const mockContactInfo: ContactInfoEntity = {
		id: 'contact1',
		name: 'John Doe',
		phone: '1234567890',
		userId: 'user1',
		createdAt: new Date('2023-01-01'),
		updatedAt: new Date('2023-01-01'),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReservationInfoService,
				{
					provide: IDataService,
					useValue: {
						reservations: {
							find: jest.fn(),
							findOne: jest.fn(),
							create: jest.fn(),
							updateOneById: jest.fn(),
						},
						tables: {
							findOne: jest.fn(),
						},
						contacts: {
							findOne: jest.fn(),
							create: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<ReservationInfoService>(ReservationInfoService);
		dbService = module.get(IDataService);
		user = { id: 'user1', role: 'USER' } as UserEntity;
	});

	describe('listReservations', () => {
		it('应该返回预约列表', async () => {
			const args: FindReservationInfoArgs = {
				keyword: '',
				date: '',
				status: undefined,
				seats: 0,
				page: 1,
				limit: 10,
			};

			const findSpy = jest
				.spyOn(dbService.reservations, 'find')
				.mockResolvedValueOnce([mockReservation]);

			const result = await service.listReservations(args);

			expect(result).toEqual([mockReservation]);
			expect(findSpy).toHaveBeenCalledWith(
				{},
				{
					sort: { date: 'DESC', createdAt: 'ASC' },
					limit: 10,
					skip: 0,
				},
			);
		});

		it('应该正确处理关键字搜索', async () => {
			const args: FindReservationInfoArgs = {
				keyword: 'John',
				date: '',
				status: undefined,
				seats: 0,
				page: 1,
				limit: 10,
			};

			const findSpy = jest
				.spyOn(dbService.reservations, 'find')
				.mockResolvedValueOnce([mockReservation]);

			await service.listReservations(args);

			expect(findSpy).toHaveBeenCalledWith(
				{
					$and: [
						{
							$or: [
								{ 'contact.name': { $like: '%John%' } },
								{ 'contact.phone': { $like: '%John%' } },
							],
						},
					],
				},
				expect.any(Object),
			);
		});
	});

	describe('addReservationInfo', () => {
		const input: AddReservationInfoInput = {
			date: '2023-01-01',
			numberOfPeople: 4,
			name: 'John Doe',
			phone: '1234567890',
		};

		it('应该创建新的预约和联系人', async () => {
			const mockTable = { id: 'table1', seats: 4 };

			const findTableSpy = jest.spyOn(dbService.tables, 'findOne').mockResolvedValueOnce(mockTable);
			const findContactSpy = jest
				.spyOn(dbService.contacts, 'findOne')
				.mockResolvedValueOnce(undefined);
			const createContactSpy = jest
				.spyOn(dbService.contacts, 'create')
				.mockResolvedValueOnce(mockContactInfo);
			const createReservationSpy = jest
				.spyOn(dbService.reservations, 'create')
				.mockResolvedValueOnce(mockReservation);

			const result = await service.addReservationInfo(user, input);

			expect(result).toEqual(mockReservation);
			expect(findTableSpy).toHaveBeenCalled();
			expect(findContactSpy).toHaveBeenCalled();
			expect(createContactSpy).toHaveBeenCalledWith({
				name: input.name,
				phone: input.phone,
				userId: user.id,
			});
			expect(createReservationSpy).toHaveBeenCalled();
		});
	});

	describe('updateReservationInfo', () => {
		const updateInput: UpdateReservationInfoInput = {
			id: '1',
			status: ReservationStatus.Cancelled,
			name: 'test',
			phone: '13333333333',
			date: '2022-02-02',
			numberOfPeople: 1,
		};

		it('应该允许用户取消预约', async () => {
			const findOneSpy = jest
				.spyOn(dbService.reservations, 'findOne')
				.mockResolvedValueOnce(mockReservation);
			const updateSpy = jest.spyOn(dbService.reservations, 'updateOneById').mockResolvedValueOnce({
				...mockReservation,
				status: ReservationStatus.Cancelled,
			});

			const result = await service.updateReservationInfo(user, updateInput);

			expect(result.status).toBe(ReservationStatus.Cancelled);
			expect(findOneSpy).toHaveBeenCalled();
			expect(updateSpy).toHaveBeenCalled();
		});
	});

	describe('getReservationInfo', () => {
		it('应该返回指定ID的预约信息', async () => {
			const findOneSpy = jest
				.spyOn(dbService.reservations, 'findOne')
				.mockResolvedValueOnce(mockReservation);

			const result = await service.getReservationInfo('1');

			expect(result).toEqual(mockReservation);
			expect(findOneSpy).toHaveBeenCalledWith({ id: '1' }, { lean: true });
		});
	});
});
