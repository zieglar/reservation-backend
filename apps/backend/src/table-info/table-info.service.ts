import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDataService } from '@libs/core/base/data.service';
import { TableInfoInput } from './table-info.schema';

@Injectable()
export class TableInfoService implements OnModuleInit {
	constructor(private readonly dataService: IDataService) {}

	async onModuleInit() {
		const tableCount = await this.dataService.tables.count();
		if (tableCount === 0) {
			const tables = [{ seats: 2 }, { seats: 4 }, { seats: 6 }, { seats: 8 }, { seats: 10 }];
			await this.dataService.tables.createMany(tables);
		}
	}

	async listTables() {
		return await this.dataService.tables.find(
			{},
			{ select: ['id', 'seats'], sort: { seats: 'ASC' } },
		);
	}

	async addTableInfo(data: TableInfoInput) {
		const tableCount = await this.dataService.tables.count({ seats: data.seats });
		if (tableCount > 0) {
			throw new Error('已经存在相同数量的座位的桌子，无法添加');
		}

		return await this.dataService.tables.create(data);
	}

	async updateTableInfo(id: string, data: TableInfoInput) {
		const table = await this.dataService.tables.findById(id);
		if (!table) {
			throw new Error('餐桌信息不存在');
		}

		const tableCount = await this.dataService.tables.count({ seats: data.seats, id: { $neq: id } });
		if (tableCount > 0) {
			throw new Error('已经存在相同数量的座位的桌子，无法更新');
		}

		if (table?.seats > data.seats) {
			throw new Error('不能减少座位数量');
		}

		return await this.dataService.tables.updateOneById(id, data);
	}
}
