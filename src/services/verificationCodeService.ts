import { LessThan } from 'typeorm';
import { getConnection } from '../dbConnection';
import {
	IVerificationCode,
	VerificationCode,
} from '../models/VerificationCode';

const getRepo = async () =>
	(await getConnection()).getRepository(VerificationCode);

const getAll = async () => {
	const repo = await getRepo();
	return repo.find();
};

const getByEmail = async (email: string) => {
	const repo = await getRepo();
	return repo.findOne({ email });
};

const add = async (item: IVerificationCode) => {
	const repo = await getRepo();
	await repo.save(item);

	return true;
};

const deleteExpired = async (timeMs: number) => {
	const repo = await getRepo();
	await repo.delete({ expires: LessThan(timeMs) });

	return true;
};

const remove = async (item: VerificationCode) => {
	const repo = await getRepo();
	await repo.remove(item);

	return true;
};

export default { getAll, getByEmail, add, deleteExpired, remove };
