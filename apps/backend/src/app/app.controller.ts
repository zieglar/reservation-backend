import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput, LoginInput } from '../auth/dtos';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OgmaInterceptor } from '@ogma/nestjs-module';

@ApiTags('用户相关接口')
@Controller()
@UseInterceptors(OgmaInterceptor)
export class AppController {
	constructor(private readonly authService: AuthService) {}

	@Post('auth/login')
	@ApiOperation({ summary: '用户登录' })
	@ApiBody({ type: LoginInput })
	@HttpCode(200)
	async login(@Body() data: LoginInput) {
		return this.authService.login(data);
	}

	@Post('auth/register')
	@ApiOperation({ summary: '用户注册' })
	@ApiBody({ type: CreateUserInput })
	@HttpCode(200)
	async register(@Body() data: CreateUserInput) {
		return this.authService.register(data);
	}
}
