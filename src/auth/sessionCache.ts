import { IWebSession } from '../models/WebSession';
import SessionService from '../services/webSessionService';
import { v4 } from 'uuid';

const EXPIRE_AFTER_MS = 24 * 60 * 60 * 1000;
const CLEAR_EXPIRED_EVERY_N_MS = 60 * 60 * 1000;

interface ISessionsMap {
	[token: string]: IWebSession;
}

let interval: NodeJS.Timeout | null = null;

let sessionsMap: ISessionsMap = {};

const getSession = (token: string): IWebSession | undefined =>
	sessionsMap[token];

const init = async () => {
	const allSessions = await SessionService.getAll();
	sessionsMap = {};
	allSessions.forEach(session => {
		sessionsMap[session.token] = session;
	});
	clearExpired();
	interval = setInterval(clearExpired, CLEAR_EXPIRED_EVERY_N_MS);
};

const newSession = async (userId: number) => {
	const session: IWebSession = {
		userId,
		expires: new Date().getTime() + EXPIRE_AFTER_MS,
		token: v4(),
	};
	sessionsMap[session.token] = session;
	await SessionService.add(session);
	return session;
};

const removeSession = (token: string) => {
	delete sessionsMap[token];
};

const clearExpired = async () => {
	const timeMs = new Date().getTime();
	const expired = Object.values(sessionsMap).filter(
		({ expires }) => timeMs >= expires,
	);
	expired.forEach(({ token }) => {
		delete sessionsMap[token];
	});
	await SessionService.deleteExpired(timeMs);
};

const cleanup = async () => {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
};

export default {
	getSession,
	newSession,
	removeSession,
	init,
	cleanup,
};
