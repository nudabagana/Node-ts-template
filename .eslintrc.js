module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'jest'],
	extends: [
		// 'eslint:recommended',
		// 'plugin:@typescript-eslint/eslint-recommended',
		// 'plugin:@typescript-eslint/recommended',
		'airbnb-typescript/base',
		'prettier/@typescript-eslint',
		'plugin:jest/recommended',
	],
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		'no-tabs': 'off',
		'object-curly-newline': 'off',
		'import/prefer-default-export': 'off',
		'class-methods-use-this': 'off',
		'import/newline-after-import': 'off',
		'arrow-parens': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'consistent-return': 'off',
		'import/order': 'off',
	},
};
