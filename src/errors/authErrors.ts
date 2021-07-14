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

export class ExistingUsernameError extends Errors.HttpError {
	constructor() {
		super('ExistingUsernameError', 'Username already exists.');
		this.statusCode = 432;
	}
}

export class ExistingEmailError extends Errors.HttpError {
	constructor() {
		super('ExistingEmailError', 'Email already exists.');
		this.statusCode = 433;
	}
}

export class BadCodeError extends Errors.HttpError {
	constructor() {
		super('BadCodeError', 'Bad code.');
		this.statusCode = 434;
	}
}

export class BadParamsError extends Errors.HttpError {
	constructor() {
		super('BadParamsError', 'Bad input params.');
		this.statusCode = 435;
	}
}

export class BadPassError extends Errors.HttpError {
	constructor() {
		super('BadPassError', 'Bad password.');
		this.statusCode = 436;
	}
}
