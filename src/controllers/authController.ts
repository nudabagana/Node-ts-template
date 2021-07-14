import { compare, genSalt, hash } from 'bcrypt';
import { GET, Path, PathParam, POST, PreProcessor } from 'typescript-rest';
import sessionCache from '../auth/sessionCache';
import { IWebUser } from '../models/WebUser';
import UserService from '../services/webUserService';
import {
	BadUserPassError,
	ExistingEmailError,
	ExistingUsernameError,
	UnauthorizedError,
	BadCodeError,
	BadParamsError,
	BadPassError,
} from '../errors/authErrors';
import { Tags } from 'typescript-rest-swagger';
import { Authorized, ICtx } from '../auth/authValidator';
import WebSessionService from '../services/webSessionService';
import { logger } from '../logger';
import verificationCodes from '../auth/verificationCodes';
import mailService from '../services/mailService';
import passwordResetLinks from '../auth/passwordResetLinks';
import { WEBAPP_URL } from '../consts';
import { InternalServerError } from 'typescript-rest/dist/server/model/errors';

interface ILoginBody {
	password: string;
	email: string;
}
interface IRegBody extends ILoginBody {
	username: string;
	verificationCode: number | string;
}

interface ILoginResponse {
	token: string;
}

interface IDefaultResponse {
	msg: string;
}

interface IPassResetBody {
	link: string;
	password: string;
}

interface IChangePassBody extends ICtx {
	oldPassword: string;
	newPassword: string;
}

@Tags('Auth')
@Path('/auth')
export class authController {
	@Path('login')
	@POST
	async login({ email, password }: ILoginBody): Promise<ILoginResponse> {
		if (!email || !password) {
			throw new BadUserPassError();
		}
		const user = await UserService.getByEmail(email);

		if (
			!user ||
			user.suspended ||
			!(await compare(password, user.password))
		) {
			throw new BadUserPassError();
		}

		if (!user.authorized) {
			throw new UnauthorizedError();
		}

		const { token } = await sessionCache.newSession(user.id);
		return { token };
	}

	@Path('logout')
	@POST
	@PreProcessor(Authorized)
	async logout(req: ICtx): Promise<IDefaultResponse> {
		sessionCache.removeSession(req.token!);
		try {
			await WebSessionService.removeByUserId(req.userId!);
		} catch (e) {
			logger.error(e);
		}
		return { msg: 'Logged out' };
	}

	@Path('register')
	@POST
	async register({
		username,
		password,
		email,
		verificationCode,
	}: IRegBody): Promise<IDefaultResponse> {
		if (
			!username ||
			!password ||
			!email ||
			!verificationCode ||
			!isValidEmail(email)
		) {
			throw new BadParamsError();
		}
		if (
			!(await verificationCodes.isCodeValid(
				email,
				Number(verificationCode),
			))
		) {
			throw new BadCodeError();
		}
		const existingUsername = await UserService.getByUsername(username);
		if (existingUsername) {
			throw new ExistingUsernameError();
		}
		const existingEmail = await UserService.getByEmail(email);
		if (existingEmail) {
			throw new ExistingEmailError();
		}

		const user: IWebUser = {
			username,
			password: await hashPass(password),
			authorized: true,
			email,
			admin: false,
			suspended: false,
		};
		await UserService.add(user);
		return { msg: 'Registration successfull' };
	}

	@Path('sendcode')
	@POST
	async sendCode({ email }: { email: string }): Promise<IDefaultResponse> {
		if (!email || !isValidEmail(email)) {
			throw new BadParamsError();
		}
		const code = await verificationCodes.getCode(email);
		await mailService.sendEmailCode(code, email);

		return { msg: 'Code sent!' };
	}

	@Path('sendPassResetLink')
	@POST
	async sendPassResetLink({ email }: { email: string }): Promise<boolean> {
		if (!email || !isValidEmail(email)) {
			throw new BadParamsError();
		}
		const account = await UserService.getByEmail(email);
		if (account) {
			const link = await passwordResetLinks.getLink(email);
			await mailService.sendPassResetLink(
				`${WEBAPP_URL}/reset-password/${link}`,
				email,
			);
		}

		return true;
	}

	@Path('isPassResetLinkValid/:link')
	@GET
	async isPassResetLinkValid(
		@PathParam('link') link: string,
	): Promise<boolean> {
		return passwordResetLinks.isLinkValid(link);
	}

	@Path('resetPass')
	@POST
	async resetPass({ link, password }: IPassResetBody): Promise<boolean> {
		const email = await passwordResetLinks.useLink(link);
		if (email) {
			const user = await UserService.getByEmail(email);
			if (user) {
				user.password = await hashPass(password);
				await UserService.update(user);
				return true;
			}
		}
		throw new InternalServerError();
	}

	@PreProcessor(Authorized)
	@Path('changePass')
	@POST
	async changePass({
		newPassword,
		oldPassword,
		userId,
	}: IChangePassBody): Promise<boolean> {
		const user = await UserService.getById(userId!);

		if (user) {
			if (!(await compare(oldPassword, user.password))) {
				throw new BadPassError();
			}
			user.password = await hashPass(newPassword);
			await UserService.update(user);
			return true;
		}
		throw new InternalServerError();
	}
}

const isValidEmail = (email: string) => {
	const re = /\S+@\S+/;
	return re.test(email);
};

const hashPass = async (password: string) => {
	const salt = await genSalt(10);
	return hash(password, salt);
};
