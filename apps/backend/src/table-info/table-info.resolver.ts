import { Query, Resolver } from '@nestjs/graphql';
import { TableInfoService } from './table-info.service';
import { TableInfoEntity } from '@libs/shared';

@Resolver()
export class TableInfoResolver {
	constructor(private readonly service: TableInfoService) {}

	@Query(() => [TableInfoEntity], {
		name: 'tables',
		description: '获取所有餐桌信息',
	})
	async listTables() {
		return await this.service.listTables();
	}
}
