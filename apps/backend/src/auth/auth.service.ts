import { BadRequestException, Injectable } from '@nestjs/common';
import { IDataService } from '@libs/core/base/data.service';
import { CreateUserInput, LoginInput, LoginResponseDto } from './dtos';
import { randomString } from 'utility';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { PasswordProvider } from '@libs/shared/providers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly dbService: IDataService,
		private readonly passwordProvider: PasswordProvider,
		private readonly jwtService: JwtService,
		@OgmaLogger(AuthService) private readonly logger: OgmaService,
	) {}

	async login(data: LoginInput): Promise<LoginResponseDto> {
		const user = await this.dbService.users.findOne({
			username: data.username,
		});
		if (!user) {
			throw new BadRequestException('用户名或密码错误');
		}
		if (!user.enabled && user.role === 'staff' && !data.verifyCode) {
			throw new BadRequestException('用户未激活，请联系管理员提供验证码一起提交登录激活');
		}

		if (!user.enabled && user.verifyCode !== data.verifyCode) {
			throw new BadRequestException('验证码错误');
		}

		const authResult = this.passwordProvider.compare(data.password, user.password);
		if (!authResult) {
			throw new BadRequestException('用户名或密码错误');
		}

		await this.dbService.users.updateOneById(user.id, {
			enabled: true,
			verifyCode: '',
		});

		const token = await this.jwtService.signAsync({
			userId: user.id,
			username: user.username,
			role: user.role,
		});

		return {
			id: user.id,
			name: user.username,
			accessToken: token,
			role: user.role,
		};
	}

	async register(data: CreateUserInput) {
		const existUser = await this.dbService.users.count({ username: data.username, enabled: true });
		if (existUser > 0) {
			throw new BadRequestException('用户名已存在');
		}

		const user = await this.dbService.users.create({
			username: data.username,
			password: this.passwordProvider.hash(data.password),
			enabled: data.role !== 'staff',
			verifyCode: data.role === 'staff' ? randomString(4, '123456789') : '',
			role: data.role,
		});

		if (data.role === 'staff') {
			this.logger.warn(`已经注册用户 ${user.username}，验证码为 ${user.verifyCode}`, 'AuthService');
		}
		return user;
	}
}
