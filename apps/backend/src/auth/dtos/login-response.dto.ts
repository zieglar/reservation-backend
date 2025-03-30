export class LoginResponseDto {
	/**
	 *   用户ID
	 */
	id: string;
	/**
	 * 用户名或用户手机号
	 */
	name: string;
	/**
	 * token
	 */
	accessToken: string;
	/**
	 * 身份类别
	 */
	role: string;
}
