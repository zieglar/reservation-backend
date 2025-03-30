import { Module } from '@nestjs/common';
import { TableInfoService } from './table-info.service';
import { TableInfoResolver } from './table-info.resolver';
import { OttomanModule } from '@libs/core';

@Module({
	imports: [OttomanModule],
	providers: [TableInfoService, TableInfoResolver],
})
export class TableInfoModule {}
