/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	moduleFileExtensions: ['js', 'json', 'ts'],
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: './coverage',
	roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
	moduleNameMapper: {
		'^@libs/shared(|/.*)$': '<rootDir>/libs/shared/src/$1',
		'^@libs/core(|/.*)$': '<rootDir>/libs/core/src/$1',
		'^@libs/(.*)$': '<rootDir>/libs/$1/src',
		'^@apps/(.*)$': '<rootDir>/apps/$1/src',
	},
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
};

// "jest": {
//   "moduleFileExtensions": [
//     "js",
//     "json",
//     "ts"
//   ],
//     "rootDir": ".",
//     "testRegex": ".*\\.spec\\.ts$",
//     "transform": {
//     "^.+\\.(t|j)s$": "ts-jest"
//   },
//   "collectCoverageFrom": [
//     "**/*.(t|j)s"
//   ],
//     "coverageDirectory": "./coverage",
//     "testEnvironment": "node",
//     "roots": [
//     "<rootDir>/apps/",
//     "<rootDir>/libs/"
//   ],
//     "moduleNameMapper": {
//     "^@libs/shared(|/.*)$": "<rootDir>/libs/shared/src/$1",
//       "^@libs/core(|/.*)$": "<rootDir>/libs/core/src/$1"
//   }
// },
