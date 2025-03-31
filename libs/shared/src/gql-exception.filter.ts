import { GqlArgumentsHost, GqlExceptionFilter as orgGqlExceptionFilter } from '@nestjs/graphql';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Catch(HttpException)
export class GqlExceptionFilter implements orgGqlExceptionFilter {
	constructor(@OgmaLogger(GqlExceptionFilter) private readonly logger: OgmaService) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const gqlHost = GqlArgumentsHost.create(host);
		this.logger.error(exception.getResponse());
		return exception;
	}
}
