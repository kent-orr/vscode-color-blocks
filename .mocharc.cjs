process.env.TS_NODE_PROJECT = 'test/tsconfig.json';

module.exports = {
	require: 'ts-node/register',
	spec: 'test/unit/**/*.test.ts',
	extensions: ['ts'],
};
