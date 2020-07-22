import { Errors } from 'typescript-rest';

export class UnauthorizedError extends Errors.HttpError {
	constructor() {
		super('UnauthroziedError', 'User not authrozied.');
		this.statusCode = 430;
	}
}

export class BadUserPassError extends Errors.HttpError {
	constructor() {
		super('BadUserPassError', 'Bad username or password.');
		this.statusCode = 431;
	}
}
