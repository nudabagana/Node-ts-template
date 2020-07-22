import { Connection, createConnection } from 'typeorm';
import * as dbConfig from './ormconfig';

let connection: Connection | null = null;

export const dbConnect = async () => {
	if (!connection) {
		connection = await createConnection(dbConfig);
	}
	return connection;
};

export const getConnection = async () => {
	if (connection) {
		return connection;
	}
	return dbConnect();
};

export const dbDisconnect = async () => {
	if (connection) {
		await connection.close();
		connection = null;
	}
};
