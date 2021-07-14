import { MS_IN_H } from '../consts';
import { IPasswordResetLink } from '../models/PasswordResetLink';
import passwordResetLinkService from '../services/passwordResetLinkService';
import { v4 } from 'uuid';

const CODE_VALID_DURATION = 1 * MS_IN_H;

let intervalId: NodeJS.Timeout | null = null;

const getLink = async (email: string) => {
	const existingItem = await passwordResetLinkService.getByEmail(email);
	if (existingItem) {
		return existingItem.link;
	}
	const newItem: IPasswordResetLink = {
		email,
		link: v4(),
		expires: Date.now() + CODE_VALID_DURATION,
	};
	await passwordResetLinkService.add(newItem);
	return newItem.link;
};

const isLinkValid = async (link: string) =>
	!!(await passwordResetLinkService.getByLink(link));

const useLink = async (link: string) => {
	const resetLink = await passwordResetLinkService.getByLink(link);
	if (resetLink) {
		await passwordResetLinkService.remove(resetLink);
		return resetLink.email;
	}
	return undefined;
};

const start = () => {
	stop();
	intervalId = setInterval(clearOldCodes, CODE_VALID_DURATION);
};

const stop = () => {
	if (intervalId) {
		clearInterval(intervalId);
	}
};

const clearOldCodes = () => passwordResetLinkService.deleteExpired(Date.now());

export default {
	start,
	stop,
	getLink,
	isLinkValid,
	useLink,
};
