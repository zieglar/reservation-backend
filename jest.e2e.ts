import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	roots: ['../src'],
	setupFilesAfterEnv: ['./test/setupTests.e2e.ts'],
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
};

export default config;
