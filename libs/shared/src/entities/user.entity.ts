import { FullBaseEntity } from '@libs/shared/entities/base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Allow, IsIn, IsNotEmpty } from 'class-validator';
import { ROLE_STAFF, ROLE_USER } from '@libs/shared/constants';

@ObjectType({ description: '用户信息' })
export class UserEntity extends FullBaseEntity {
	/**
	 * 用户名
	 */
	@IsNotEmpty()
	@Allow()
	@Field(() => String, { description: '用户名' })
	username: string;

	/**
	 * 密码
	 */
	@IsNotEmpty()
	@Allow()
	@Exclude()
	@Field(() => String, { description: '密码' })
	password: string;

	/**
	 * 是否可用
	 */
	enabled: boolean;

	/**
	 * 是否已验证
	 */
	@Exclude()
	@Allow()
	verifyCode: string;

	/**
	 * 身份类别
	 */
	@Allow()
	@Field(() => String, { description: '身份类别' })
	@IsIn([ROLE_USER, ROLE_STAFF])
	role: string;
}
