import { Query, Resolver } from '@nestjs/graphql';
import { ContactInfoEntity } from '@libs/shared';
import { ContactInfoService } from './contact-info.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from '../auth/jwt-gql-auth.guard';

@Resolver()
export class ContactInfoResolver {
	constructor(private readonly service: ContactInfoService) {}

	@Query(() => [ContactInfoEntity], {
		name: 'contacts',
		description: '获取所有联系人信息',
	})
	@UseGuards(JwtGqlAuthGuard)
	async listContacts() {
		return await this.service.listContacts();
	}
}
