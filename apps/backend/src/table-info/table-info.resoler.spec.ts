import { Test, TestingModule } from '@nestjs/testing';
import { TableInfoResolver } from './table-info.resolver';
import { TableInfoService } from './table-info.service';
import { TableInfoEntity } from '@libs/shared';

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
				{
					id: '1',
					seats: 4,
				},
				{
					id: '2',
					seats: 2,
				},
			];
			jest.spyOn(service, 'listTables').mockResolvedValue(tables);

			const result = await resolver.listTables();

			expect(result).toEqual(tables);
			expect(service.listTables).toHaveBeenCalled();
		});

		it('服务失败时应该抛出错误', async () => {
			jest.spyOn(service, 'listTables').mockRejectedValue(new Error('Service error'));

			await expect(resolver.listTables()).rejects.toThrow('Service error');
		});
	});
});
