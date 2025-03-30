import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDataService } from '@libs/core/base/data.service';

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
}
