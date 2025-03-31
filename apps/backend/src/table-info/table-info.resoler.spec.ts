import { Test, TestingModule } from '@nestjs/testing';
import { TableInfoResolver } from './table-info.resolver';
import { TableInfoService } from './table-info.service';
import { TableInfoEntity } from '@libs/shared';
import { TableInfoInput } from './table-info.schema';

describe('TableInfoResolver', () => {
	let resolver: TableInfoResolver;
	let service: TableInfoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TableInfoResolver,
				{
					provide: TableInfoService,
					useValue: {
						listTables: jest.fn(),
						addTableInfo: jest.fn(),
						updateTableInfo: jest.fn(),
					},
				},
			],
		}).compile();

		resolver = module.get<TableInfoResolver>(TableInfoResolver);
		service = module.get<TableInfoService>(TableInfoService);
	});

	it('应该被定义', () => {
		expect(resolver).toBeDefined();
	});

	describe('listTables', () => {
		it('应该返回餐桌数组', async () => {
			const tables: TableInfoEntity[] = [
				{ id: '1', seats: 4 },
				{ id: '2', seats: 2 },
			];
			const listSpy = jest.spyOn(service, 'listTables').mockResolvedValue(tables);

			const result = await resolver.listTables();

			expect(result).toEqual(tables);
			expect(listSpy).toHaveBeenCalled();
		});
	});

	describe('addTableInfo', () => {
		it('应该成功新增餐桌信息', async () => {
			const table: TableInfoEntity = { id: '3', seats: 6 };
			const input: TableInfoInput = { seats: 6 };
			const addSpy = jest.spyOn(service, 'addTableInfo').mockResolvedValue(table);

			const result = await resolver.addTableInfo(input);

			expect(result).toEqual(table);
			expect(addSpy).toHaveBeenCalledWith(input);
		});
	});

	describe('updateTableInfo', () => {
		it('应该成功更新餐桌信息', async () => {
			const table: TableInfoEntity = { id: '1', seats: 8 };
			const input: TableInfoInput = { seats: 8 };
			const updateSpy = jest.spyOn(service, 'updateTableInfo').mockResolvedValue(table);

			const result = await resolver.updateTableInfo('1', input);

			expect(result).toEqual(table);
			expect(updateSpy).toHaveBeenCalledWith('1', input);
		});
	});
});
