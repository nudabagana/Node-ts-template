import { LessThan } from 'typeorm';
import { getConnection } from '../dbConnection';
import {
	IPasswordResetLink,
	PasswordResetLink,
} from '../models/PasswordResetLink';

const getRepo = async () =>
	(await getConnection()).getRepository(PasswordResetLink);

const getAll = async () => {
	const repo = await getRepo();
	return repo.find();
};

const getByEmail = async (email: string) => {
	const repo = await getRepo();
	return repo.findOne({ email });
};

const getByLink = async (link: string) => {
	const repo = await getRepo();
	return repo.findOne({ link });
};

const add = async (item: IPasswordResetLink) => {
	const repo = await getRepo();
	await repo.save(item);

	return true;
};

const deleteExpired = async (timeMs: number) => {
	const repo = await getRepo();
	await repo.delete({ expires: LessThan(timeMs) });

	return true;
};

const remove = async (item: PasswordResetLink) => {
	const repo = await getRepo();
	await repo.remove(item);

	return true;
};

export default { getAll, getByEmail, add, deleteExpired, remove, getByLink };
