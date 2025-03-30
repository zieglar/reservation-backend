import { Module } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoResolver } from './contact-info.resolver';
import { OttomanModule } from '@libs/core';

@Module({
	imports: [OttomanModule],
	providers: [ContactInfoService, ContactInfoResolver],
})
export class ContactInfoModule {}
