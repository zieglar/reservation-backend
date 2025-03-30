import { FullBaseEntity } from '@libs/shared/entities/base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '联系人信息' })
export class ContactInfoEntity extends FullBaseEntity {
	@Field(() => String, { description: '姓名' })
	name: string;

	@Field(() => String, { description: '电话' })
	phone: string;

	userId: string;
}

@ObjectType({ description: '简易联系人信息' })
export class SimpleContactInfo {
	@Field(() => String, { description: '姓名' })
	name: string;

	@Field(() => String, { description: '电话' })
	phone: string;
}
