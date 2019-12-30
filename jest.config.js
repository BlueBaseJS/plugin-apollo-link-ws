const configs = require('@bluebase/code-standards/jest.config');

module.exports = Object.assign(configs, {
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
});
