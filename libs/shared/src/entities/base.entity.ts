import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class FullBaseEntity {
	@Field(() => String)
	id: string;

	@Field(() => String)
	createdAt: Date;

	@Field(() => String)
	updatedAt: Date;
}

@ObjectType()
export abstract class IdBaseEntity {
	@Field(() => String)
	id: string;
}
