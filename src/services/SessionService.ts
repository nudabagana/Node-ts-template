import { LessThan } from 'typeorm';
import { getConnection } from '../dbConnection';
import { ISession, Session } from '../models/Session';

const getRepo = async () => (await getConnection()).getRepository(Session);

const getAll = async () => {
	const repo = await getRepo();
	return repo.find();
};

const getByToken = async (token: string) => {
	const repo = await getRepo();
	return repo.findOne({ token });
};

const add = async (item: ISession) => {
	const repo = await getRepo();
	await repo.save(item);

	return true;
};

const deleteExpired = async (timeMs: number) => {
	const repo = await getRepo();
	await repo.delete({ expires: LessThan(timeMs) });

	return true;
};

export default { getAll, getById: getByToken, add, deleteExpired };
