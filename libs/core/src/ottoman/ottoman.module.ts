import { Module } from '@nestjs/common';
import { OttomanService } from './ottoman.service';
import { IDataService } from '@libs/core/base/data.service';

@Module({
	providers: [
		{
			provide: IDataService,
			useClass: OttomanService,
		},
	],
	exports: [IDataService],
})
export class OttomanModule {}
