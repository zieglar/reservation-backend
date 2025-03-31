import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'path';
import { ContactInfoModule } from '../contact-info';
import { TableInfoModule } from '../table-info';
import { ReservationInfoModule } from '../reservation-info';
import { AuthModule } from '../auth/auth.module';
import { OgmaModule } from '@ogma/nestjs-module';
import { FastifyParser } from '@ogma/platform-fastify';
import { GraphQLFastifyParser } from '@ogma/platform-graphql-fastify';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GqlExceptionFilter } from '@libs/shared';

@Module({
	imports: [
		OgmaModule.forRoot({
			color: true,
			json: false,
			logHostname: false,
			logApplication: false,
		}),
		OgmaModule.forFeature(GqlExceptionFilter),
		AuthModule,
		ContactInfoModule,
		TableInfoModule,
		ReservationInfoModule,
		GraphQLModule.forRoot<MercuriusDriverConfig>({
			driver: MercuriusDriver,
			autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
			graphiql: true,
			include: [ContactInfoModule, TableInfoModule, ReservationInfoModule],
			context: (req: FastifyRequest, res: FastifyReply) => ({
				req,
				res,
			}),
		}),
	],
	controllers: [AppController],
	providers: [
		{ provide: APP_FILTER, useClass: GqlExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
		FastifyParser,
		GraphQLFastifyParser,
	],
})
export class AppModule {}
