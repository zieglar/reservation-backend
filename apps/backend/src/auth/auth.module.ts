import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envSchema, OttomanModule } from '@libs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { OgmaModule } from '@ogma/nestjs-module';
import { PasswordProvider } from '@libs/shared/providers';

@Module({
	imports: [
		OttomanModule,
		PassportModule,
		JwtModule.register({
			secret: envSchema.JWT_SECRET,
			signOptions: { expiresIn: '7d' },
		}),
		OgmaModule.forFeature(AuthService),
	],
	providers: [AuthService, JwtStrategy, PasswordProvider],
	exports: [AuthService],
})
export class AuthModule {}
