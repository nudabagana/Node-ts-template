import { getConnection } from '../dbConnection';
import { IWebUser, WebUser } from '../models/WebUser';

const getRepo = async () => (await getConnection()).getRepository(WebUser);

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

const getByEmail = async (email: string) => {
	const repo = await getRepo();
	return repo.findOne({ email });
};

const add = async (item: IWebUser): Promise<WebUser> => {
	const repo = await getRepo();
	const user = await repo.save(item);

	return user;
};

const update = async (item: WebUser) => {
	const repo = await getRepo();
	repo.save(item);
};

export default { getAll, getById, add, getByUsername, getByEmail, update };
