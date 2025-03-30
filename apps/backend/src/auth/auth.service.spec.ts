import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IDataService } from '@libs/core/base/data.service';
import { PasswordProvider } from '@libs/shared/providers';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { CreateUserInput, LoginInput } from './dtos';

describe('AuthService', () => {
	let service: AuthService;
	let dbService: IDataService;
	let passwordProvider: PasswordProvider;
	let jwtService: JwtService;
	let logger: { warn: jest.Mock };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: IDataService,
					useValue: {
						users: {
							findOne: jest.fn(),
							updateOneById: jest.fn(),
							count: jest.fn(),
							create: jest.fn(),
						},
					},
				},
				{
					provide: PasswordProvider,
					useValue: {
						compare: jest.fn(),
						hash: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						signAsync: jest.fn(),
					},
				},
				{
					provide: 'OGMA_SERVICE:AuthService',
					useValue: {
						warn: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		dbService = module.get<IDataService>(IDataService);
		passwordProvider = module.get<PasswordProvider>(PasswordProvider);
		jwtService = module.get<JwtService>(JwtService);
		logger = module.get<{ warn: jest.Mock }>('OGMA_SERVICE:AuthService');
	});

	it('应该成功登录用户', async () => {
		const loginInput: LoginInput = { username: 'testuser', password: 'password', verifyCode: '' };
		const user = {
			id: '1',
			username: 'testuser',
			password: 'hashedpassword',
			enabled: true,
			role: 'user',
			verifyCode: '',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		jest.spyOn(dbService.users, 'findOne').mockResolvedValue(user);
		jest.spyOn(passwordProvider, 'compare').mockReturnValue(true);
		jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

		const result = await service.login(loginInput);

		expect(result).toEqual({ id: '1', name: 'testuser', accessToken: 'token', role: 'user' });
	});

	it('应该抛出错误当用户名不存在时', async () => {
		const loginInput: LoginInput = { username: 'testuser', password: 'password', verifyCode: '' };
		jest.spyOn(dbService.users, 'findOne').mockResolvedValue(undefined);

		await expect(service.login(loginInput)).rejects.toThrow(BadRequestException);
	});

	it('应该抛出错误当密码不匹配时', async () => {
		const loginInput: LoginInput = { username: 'testuser', password: 'password', verifyCode: '' };
		const user = {
			id: '1',
			username: 'testuser',
			password: 'hashedpassword',
			enabled: true,
			role: 'user',
			verifyCode: '',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		jest.spyOn(dbService.users, 'findOne').mockResolvedValue(user);
		jest.spyOn(passwordProvider, 'compare').mockReturnValue(false);

		await expect(service.login(loginInput)).rejects.toThrow(BadRequestException);
	});

	it('应该成功注册用户', async () => {
		const registerInput: CreateUserInput = {
			username: 'newuser',
			password: 'password',
			role: 'user',
		};
		const user = {
			id: '1',
			username: 'newuser',
			password: 'hashedpassword',
			enabled: false,
			role: 'user',
			verifyCode: '',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		jest.spyOn(dbService.users, 'count').mockResolvedValue(0);
		jest.spyOn(passwordProvider, 'hash').mockReturnValue('hashedpassword');
		jest.spyOn(dbService.users, 'create').mockResolvedValue(user);

		const result = await service.register(registerInput);

		expect(result).toEqual(user);
	});

	it('应该抛出错误当用户名已存在时', async () => {
		const registerInput: CreateUserInput = {
			username: 'existinguser',
			password: 'password',
			role: 'user',
		};
		jest.spyOn(dbService.users, 'count').mockResolvedValue(1);

		await expect(service.register(registerInput)).rejects.toThrow(BadRequestException);
	});
});
