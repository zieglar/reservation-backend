import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class PasswordProvider {
	hash(password: string): string {
		return bcrypt.hashSync(password, SALT_OR_ROUNDS);
	}

	compare(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}
}
