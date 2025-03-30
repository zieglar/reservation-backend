import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const envSchema = createEnv({
	server: {
		PORT: z.number().optional().default(3000),
		NODE_ENV: z.string().optional().default('development'),
		COUCHBASE_CONNECTION_STRING: z.string({
			required_error: 'Couchbase connection string is required',
		}),
		COUCHBASE_USERNAME: z.string({ required_error: 'Couchbase username is required' }),
		COUCHBASE_PASSWORD: z.string({ required_error: 'Couchbase password is required' }),
		COUCHBASE_BUCKET_NAME: z.string({ required_error: 'Couchbase bucket name is required' }),
		JWT_SECRET: z.string().optional().default('secret'),
	},
	runtimeEnvStrict: {
		PORT: process.env.PORT,
		NODE_ENV: process.env.NODE_ENV,
		COUCHBASE_CONNECTION_STRING: process.env.COUCHBASE_CONNECTION_STRING,
		COUCHBASE_USERNAME: process.env.COUCHBASE_USERNAME,
		COUCHBASE_PASSWORD: process.env.COUCHBASE_PASSWORD,
		COUCHBASE_BUCKET_NAME: process.env.COUCHBASE_BUCKET_NAME,
		JWT_SECRET: process.env.JWT_SECRET,
	},
});
