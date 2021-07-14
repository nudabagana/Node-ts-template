import rateLimit from 'express-rate-limit';
import { MS_IN_MIN, MS_IN_S } from './consts';

export const rateLimiters: { path: string; options?: rateLimit.Options }[] = [
	{
		path: '/auth/register',
		options: {
			windowMs: 5 * MS_IN_MIN,
			max: 10,
		},
	},
	{
		path: '/auth/login',
		options: {
			windowMs: MS_IN_MIN,
			max: 5,
			skipSuccessfulRequests: true,
		},
	},
	{
		path: '/auth/sendcode',
		options: {
			windowMs: 50 * MS_IN_S,
			max: 1,
			skipFailedRequests: true,
		},
	},
	{
		path: '/auth/sendPassResetLink',
		options: {
			windowMs: 2 * MS_IN_MIN,
			max: 3,
			skipFailedRequests: true,
		},
	},
	{
		path: '/auth/isPassResetLinkValid',
		options: {
			windowMs: 1 * MS_IN_MIN,
			max: 3,
			skipSuccessfulRequests: true,
		},
	},
	{
		path: '/auth/resetPass',
		options: {
			windowMs: 1 * MS_IN_MIN,
			max: 1,
			skipSuccessfulRequests: true,
		},
	},
	{
		path: '/auth/changePass',
		options: {
			windowMs: 5 * MS_IN_MIN,
			max: 5,
		},
	},
];
