import { MS_IN_H } from '../consts';
import verificationCodeService from '../services/verificationCodeService';

const CODE_VALID_DURATION = 6 * MS_IN_H;

let intervalId: NodeJS.Timeout | null = null;

const getCode = async (email: string) => {
	const existingItem = await verificationCodeService.getByEmail(email);
	if (existingItem) {
		return existingItem.code;
	}
	const newItem = {
		email,
		code: genRandomCode(),
		expires: Date.now() + CODE_VALID_DURATION,
	};
	await verificationCodeService.add(newItem);
	return newItem.code;
};

const isCodeValid = async (email: string, code: number) =>
	(await verificationCodeService.getByEmail(email))?.code === code;

const start = () => {
	stop();
	intervalId = setInterval(clearOldCodes, CODE_VALID_DURATION);
};

const stop = () => {
	if (intervalId) {
		clearInterval(intervalId);
	}
};

const clearOldCodes = () => verificationCodeService.deleteExpired(Date.now());

const genRandomCode = () => Math.floor(100000 + Math.random() * 900000);

export default {
	start,
	stop,
	getCode,
	isCodeValid,
};
