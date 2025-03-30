import { Injectable } from '@nestjs/common';
import { IDataService } from '@libs/core/base/data.service';

@Injectable()
export class ContactInfoService {
	constructor(private readonly dataService: IDataService) {}

	async listContacts() {
		return await this.dataService.contacts.find({}, { sort: { createdAt: 'DESC' } });
	}
}
