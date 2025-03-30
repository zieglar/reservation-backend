import { Allow, IsNotEmpty } from 'class-validator';

export class LoginInput {
	/**
	 * 用户名
	 */
	@IsNotEmpty()
	@Allow()
	username: string;

	/**
	 * 密码
	 */
	@IsNotEmpty()
	@Allow()
	password: string;

	/**
	 * 是否已验证
	 */
	@Allow()
	verifyCode?: string;
}
