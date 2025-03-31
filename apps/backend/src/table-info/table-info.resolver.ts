import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TableInfoService } from './table-info.service';
import { TableInfoEntity } from '@libs/shared';
import { TableInfoInput } from './table-info.schema';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from '../auth/jwt-gql-auth.guard';

@Resolver()
export class TableInfoResolver {
	constructor(private readonly service: TableInfoService) {}

	@Query(() => [TableInfoEntity], {
		name: 'tables',
		description: '获取所有餐桌信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async listTables() {
		return await this.service.listTables();
	}

	@Mutation(() => TableInfoEntity, {
		description: '新增餐桌信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async addTableInfo(@Args('data') data: TableInfoInput): Promise<TableInfoEntity> {
		return await this.service.addTableInfo(data);
	}

	@Mutation(() => TableInfoEntity, {
		description: '修改餐桌信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async updateTableInfo(
		@Args('id') id: string,
		@Args('data') data: TableInfoInput,
	): Promise<TableInfoEntity> {
		return await this.service.updateTableInfo(id, data);
	}
}
