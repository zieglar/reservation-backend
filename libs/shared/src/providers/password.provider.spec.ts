import { Test, TestingModule } from '@nestjs/testing';
import { PasswordProvider } from './password.provider';
import * as bcrypt from 'bcryptjs';

describe('PasswordProvider', () => {
	let provider: PasswordProvider;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PasswordProvider],
		}).compile();

		provider = module.get<PasswordProvider>(PasswordProvider);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});

	it('should hash a password', () => {
		const password = 'testPassword';
		const hash = provider.hash(password);
		expect(bcrypt.compareSync(password, hash)).toBe(true);
	});

	it('should compare a password with its hash', () => {
		const password = 'testPassword';
		const hash = bcrypt.hashSync(password, 10);
		expect(provider.compare(password, hash)).toBe(true);
	});

	it('should return false for incorrect password comparison', () => {
		const password = 'testPassword';
		const hash = bcrypt.hashSync('differentPassword', 10);
		expect(provider.compare(password, hash)).toBe(false);
	});
});
