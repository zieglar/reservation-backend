import { LoginInput } from './login.input';
import { UserEntity } from '@libs/shared';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class CreateUserInput extends IntersectionType(
	PickType(LoginInput, ['username', 'password']),
	PickType(UserEntity, ['role']),
) {}
