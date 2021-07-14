import { Request } from 'express';
import { UnauthorizedError } from '../errors/authErrors';
import sessionCache from './sessionCache';

export interface ICtx {
	userId?: number;
	token?: string;
}

export const Authorized = (req: Request & ICtx) => {
	if (req.headers.authorization) {
		const session = sessionCache.getSession(req.headers.authorization);
		if (session) {
			req.body.userId = session.userId;
			req.body.token = session.token;
			return req;
		}
	}
	throw new UnauthorizedError();
};
