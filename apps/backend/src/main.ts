import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import { OgmaService } from '@ogma/nestjs-module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const fAdapt = new FastifyAdapter();
	fAdapt.register(helmet, {
		crossOriginResourcePolicy: false,
		contentSecurityPolicy: false,
	});

	const app = await NestFactory.create<NestFastifyApplication>(AppModule, fAdapt, {
		bufferLogs: true,
	});
	const logger = app.get<OgmaService>(OgmaService);
	app.useLogger(logger);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			stopAtFirstError: true,
		}),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Reservation API')
		.setDescription('API description')
		.setVersion('1.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, documentFactory(), {
		swaggerOptions: {
			tryItOutEnabled: true,
			persistAuthorization: true,
		},
	});

	await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

	const url = await app.getUrl();
	logger.log(`Listening at ${url}`, 'NestApplication');
	logger.log(`Swagger Document Deploy at ${url}/docs`, 'NestApplication');
}
bootstrap();
