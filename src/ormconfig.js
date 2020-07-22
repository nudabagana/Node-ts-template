require('dotenv').config();

const baseConfig = {
	type: 'postgres',
	port: 5432,
	logging: false,
	synchronize: false,
	entities: ['dist/models/*.js'],
	subscribers: ['dist/subscribers/*.js'],
	entitySchemas: ['dist/schemas/*.json'],
	migrations: ['dist/migrations/*.js'],
	migrationsTableName: 'typeorm-meta',
	cli: {
		entitiesDir: 'src/models',
		migrationsDir: 'src/migrations',
		subscribersDir: 'src/subscribers',
	},
};

module.exports = {
	development: {
		username: 'postgres',
		password: 'postgres',
		database: 'servicedb',
		host: '127.0.0.1',
		...baseConfig,
	},
	test: {
		username: 'postgres',
		password: 'postgres',
		database: 'servicedbtest',
		host: '127.0.0.1',
		...baseConfig,
	},
	staging: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: 'servicedb',
		host: process.env.DB_HOST,
		...baseConfig,
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: 'servicedb',
		host: process.env.DB_HOST,
		...baseConfig,
	},
}[process.env.NODE_ENV];
