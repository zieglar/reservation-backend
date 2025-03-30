import { Test, TestingModule } from '@nestjs/testing';
import { ContactInfoResolver } from './contact-info.resolver';
import { ContactInfoService } from './contact-info.service';
import { JwtGqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { ContactInfoEntity } from '@libs/shared';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('ContactInfoResolver', () => {
	let resolver: ContactInfoResolver;
	let service: ContactInfoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContactInfoResolver,
				{
					provide: ContactInfoService,
					useValue: {
						listContacts: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtGqlAuthGuard)
			.useValue({
				canActivate: (context: ExecutionContext) => {
					const ctx = GqlExecutionContext.create(context);
					return true;
				},
			})
			.compile();

		resolver = module.get<ContactInfoResolver>(ContactInfoResolver);
		service = module.get<ContactInfoService>(ContactInfoService);
	});

	it('应该被定义', () => {
		expect(resolver).toBeDefined();
	});

	describe('listContacts', () => {
		it('应该返回联系人数组', async () => {
			const contacts: ContactInfoEntity[] = [
				{
					id: '1',
					name: 'John Doe',
					createdAt: new Date('2023-01-01'),
					phone: '13333333333',
					updatedAt: new Date('2023-01-01'),
					userId: '1',
				},
				{
					id: '2',
					name: 'Jane Doe',
					createdAt: new Date('2023-02-01'),
					phone: '13333333333',
					updatedAt: new Date('2023-02-01'),
					userId: '1',
				},
			];
			jest.spyOn(service, 'listContacts').mockResolvedValue(contacts);

			const result = await resolver.listContacts();

			expect(result).toEqual(contacts);
			expect(service.listContacts).toHaveBeenCalled();
		});

		it('服务失败时应该抛出错误', async () => {
			jest.spyOn(service, 'listContacts').mockRejectedValue(new Error('Service error'));

			await expect(resolver.listContacts()).rejects.toThrow('Service error');
		});
	});
});
