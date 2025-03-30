import { Test, TestingModule } from '@nestjs/testing';
import { ReservationInfoResolver } from './reservation-info.resolver';
import { ReservationInfoService } from './reservation-info.service';
import { JwtGqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { ReservationInfoEntity, ReservationStatus, UserEntity } from '@libs/shared';
import { FindReservationInfoArgs, UpdateReservationInfoInput } from './reservation-info.schema';

describe('ReservationInfoResolver', () => {
	let resolver: ReservationInfoResolver;
	let service: ReservationInfoService;
	let user: UserEntity;

	const mockReservation: ReservationInfoEntity = {
		id: '1',
		contactId: 'contact1',
		tableId: 'table1',
		userId: 'user1',
		date: '2023-01-01',
		numberOfPeople: 4,
		status: ReservationStatus.Requested,
		createdAt: new Date('2023-01-01'),
		updatedAt: new Date('2023-01-01'),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReservationInfoResolver,
				{
					provide: ReservationInfoService,
					useValue: {
						listReservations: jest.fn(),
						addReservationInfo: jest.fn(),
						updateReservationInfo: jest.fn(),
						getReservationInfo: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtGqlAuthGuard)
			.useValue({
				canActivate: () => true,
			})
			.compile();

		resolver = module.get<ReservationInfoResolver>(ReservationInfoResolver);
		service = module.get<ReservationInfoService>(ReservationInfoService);
		user = { id: 'user1', role: 'USER' } as UserEntity;
	});

	it('应该被定义', () => {
		expect(resolver).toBeDefined();
	});

	describe('listReservations', () => {
		it('应该返回所有预约列表', async () => {
			const args: FindReservationInfoArgs = {
				keyword: '',
				date: '',
				status: undefined,
				seats: 0,
				page: 1,
				limit: 10,
			};
			const reservations: ReservationInfoEntity[] = [
				{ ...mockReservation, id: '1' },
				{ ...mockReservation, id: '2', date: '2023-02-01' },
			];

			const listReservationsSpy = jest
				.spyOn(service, 'listReservations')
				.mockResolvedValue(reservations);

			const result = await resolver.listReservations(args);

			expect(result).toEqual(reservations);
			expect(listReservationsSpy).toHaveBeenCalledWith(args);
		});
	});

	describe('listReservationsByUserId', () => {
		it('应该返回当前用户的预约列表', async () => {
			const args: FindReservationInfoArgs = {
				keyword: '',
				date: '',
				status: undefined,
				seats: 0,
				page: 1,
				limit: 10,
			};
			const reservations: ReservationInfoEntity[] = [
				{ ...mockReservation, id: '1' },
				{ ...mockReservation, id: '2' },
			];

			const listReservationsSpy = jest
				.spyOn(service, 'listReservations')
				.mockResolvedValue(reservations);

			const result = await resolver.listReservationsByUserId(user, args);

			expect(result).toEqual(reservations);
			expect(listReservationsSpy).toHaveBeenCalledWith(args, user);
		});
	});

	describe('getReservationInfo', () => {
		it('应该返回指定ID的预约信息', async () => {
			const reservation: ReservationInfoEntity = { ...mockReservation };

			const getReservationInfoSpy = jest
				.spyOn(service, 'getReservationInfo')
				.mockResolvedValue(reservation);

			const result = await resolver.getReservationInfo('1');

			expect(result).toEqual(reservation);
			expect(getReservationInfoSpy).toHaveBeenCalledWith('1');
		});
	});

	describe('updateReservationInfo', () => {
		it('应该更新预约信息', async () => {
			const input: UpdateReservationInfoInput = {
				id: '1',
				date: '2023-01-01',
				numberOfPeople: 4,
				name: 'John Doe',
				phone: '1234567890',
				status: ReservationStatus.Cancelled,
			};
			const updatedReservation: ReservationInfoEntity = {
				...mockReservation,
				status: ReservationStatus.Cancelled,
			};

			const updateReservationInfoSpy = jest
				.spyOn(service, 'updateReservationInfo')
				.mockResolvedValue(updatedReservation);

			const result = await resolver.updateReservationInfo(user, input);

			expect(result).toEqual(updatedReservation);
			expect(updateReservationInfoSpy).toHaveBeenCalledWith(user, input);
		});

		it('当更新失败时应该抛出错误', async () => {
			const input: UpdateReservationInfoInput = {
				id: '1',
				date: '2023-01-01',
				numberOfPeople: 4,
				name: 'John Doe',
				phone: '1234567890',
				status: ReservationStatus.Cancelled,
			};

			const updateReservationInfoSpy = jest
				.spyOn(service, 'updateReservationInfo')
				.mockRejectedValue(new Error('更新失败'));

			await expect(resolver.updateReservationInfo(user, input)).rejects.toThrow('更新失败');
		});
	});
});
