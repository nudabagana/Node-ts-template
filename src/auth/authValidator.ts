import { Errors } from 'typescript-rest';
import { Request } from 'express';
import sessionCache from './sessionCache';
import { UnauthorizedError } from '../errors/authErrors';

export const Authorized = (req: Request) => {
	if (
		req.headers.authorization &&
		!!sessionCache.getSession(req.headers.authorization)
	) {
		return req;
	}
	throw new UnauthorizedError();
};
