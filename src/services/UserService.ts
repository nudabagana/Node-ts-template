import { getConnection } from '../dbConnection';
import { IUser, User } from '../models/User';

const getRepo = async () => (await getConnection()).getRepository(User);

const getAll = async () => {
	const repo = await getRepo();
	return repo.find();
};

const getById = async (id: number) => {
	const repo = await getRepo();
	return repo.findOne({ id });
};

const getByUsername = async (username: string) => {
	const repo = await getRepo();
	return repo.findOne({ username });
};

const add = async (item: IUser): Promise<User> => {
	const repo = await getRepo();
	const user = await repo.save(item);

	return user;
};

export default { getAll, getById, add, getByUsername };
