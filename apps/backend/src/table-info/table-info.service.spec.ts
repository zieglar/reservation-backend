import { Test, TestingModule } from '@nestjs/testing';
import { TableInfoService } from './table-info.service';
import { IDataService } from '@libs/core/base/data.service';

describe('TableInfoService', () => {
	let service: TableInfoService;
	let dataService: IDataService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TableInfoService,
				{
					provide: IDataService,
					useValue: {
						tables: {
							count: jest.fn(),
							createMany: jest.fn(),
							find: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<TableInfoService>(TableInfoService);
		dataService = module.get<IDataService>(IDataService);
	});

	it('应该被定义', () => {
		expect(service).toBeDefined();
	});

	describe('onModuleInit', () => {
		it('如果没有表数据，应该创建初始表数据', async () => {
			jest.spyOn(dataService.tables, 'count').mockResolvedValue(0);
			const createManySpy = jest
				.spyOn(dataService.tables, 'createMany')
				.mockResolvedValue(undefined);

			await service.onModuleInit();

			expect(dataService.tables.count).toHaveBeenCalled();
			expect(createManySpy).toHaveBeenCalledWith([
				{ seats: 2 },
				{ seats: 4 },
				{ seats: 6 },
				{ seats: 8 },
				{ seats: 10 },
			]);
		});

		it('如果已有表数据，不应该创建初始表数据', async () => {
			jest.spyOn(dataService.tables, 'count').mockResolvedValue(5);
			const createManySpy = jest.spyOn(dataService.tables, 'createMany');

			await service.onModuleInit();

			expect(dataService.tables.count).toHaveBeenCalled();
			expect(createManySpy).not.toHaveBeenCalled();
		});
	});

	describe('listTables', () => {
		it('应该返回餐桌数组', async () => {
			const tables = [
				{ id: '1', seats: 2 },
				{ id: '2', seats: 4 },
			];
			jest.spyOn(dataService.tables, 'find').mockResolvedValue(tables);

			const result = await service.listTables();

			expect(result).toEqual(tables);
			expect(dataService.tables.find).toHaveBeenCalledWith(
				{},
				{ select: ['id', 'seats'], sort: { seats: 'ASC' } },
			);
		});
	});
});
