import { LessThan } from 'typeorm';
import { getConnection } from '../dbConnection';
import { IWebSession, WebSession } from '../models/WebSession';

const getRepo = async () => (await getConnection()).getRepository(WebSession);

const getAll = async () => {
	const repo = await getRepo();
	return repo.find();
};

const getByToken = async (token: string) => {
	const repo = await getRepo();
	return repo.findOne({ token });
};

const add = async (item: IWebSession) => {
	const repo = await getRepo();
	await repo.save(item);

	return true;
};

const deleteExpired = async (timeMs: number) => {
	const repo = await getRepo();
	await repo.delete({ expires: LessThan(timeMs) });

	return true;
};

const removeByUserId = async (userId: number) => {
	const repo = await getRepo();
	const item = await repo.findOne({ userId });
	if (item) {
		await repo.remove(item);
	} else {
		throw new Error('No entity found');
	}

	return true;
};

export default { getAll, getByToken, add, deleteExpired, removeByUserId };
