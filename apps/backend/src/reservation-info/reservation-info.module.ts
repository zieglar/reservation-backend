import { Module } from '@nestjs/common';
import { ReservationInfoService } from './reservation-info.service';
import { ReservationInfoResolver } from './reservation-info.resolver';
import { OttomanModule } from '@libs/core';

@Module({
	imports: [OttomanModule],
	providers: [ReservationInfoService, ReservationInfoResolver],
})
export class ReservationInfoModule {}
