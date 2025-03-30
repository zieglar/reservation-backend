import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envSchema, IDataService } from '@libs/core';
import { JwtPayload } from './dtos';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly dbService: IDataService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: envSchema.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.dbService.users.findById(payload.userId);
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}

		return user;
	}
}
