import { compare, genSalt, hash } from 'bcrypt';
import { Path, POST } from 'typescript-rest';
import sessionCache from '../auth/sessionCache';
import { IUser } from '../models/User';
import UserService from '../services/UserService';
import { BadUserPassError } from '../errors/authErrors';
import { Tags } from 'typescript-rest-swagger';

interface IBody {
	username: string;
	password: string;
}

interface ILoginResponse {
	token: string;
}

interface IRegisterResponse {
	msg: string;
}

@Tags('Auth')
@Path('/auth')
export class authController {
	@Path('login')
	@POST
	async login({ username, password }: IBody): Promise<ILoginResponse> {
		if (!username || !password) {
			throw new BadUserPassError();
		}
		const user = await UserService.getByUsername(username);
		if (!user) {
			throw new BadUserPassError();
		}
		if (!(await compare(password, user.password))) {
			throw new BadUserPassError();
		}
		if (!user.authorized) {
			throw new BadUserPassError();
		}
		const { token } = await sessionCache.newSession(user.id);
		return { token };
	}

	@Path('register')
	@POST
	async register({ username, password }: IBody): Promise<IRegisterResponse> {
		if (!username || !password) {
			throw new BadUserPassError();
		}
		const existingUser = await UserService.getByUsername(username);
		if (existingUser) {
			throw new BadUserPassError();
		}
		const user: IUser = {
			username,
			password: await hashPass(password),
			authorized: false,
		};
		await UserService.add(user);
		return { msg: 'Registration successfull' };
	}
}

const hashPass = async (password: string) => {
	const salt = await genSalt(10);
	return hash(password, salt);
};
