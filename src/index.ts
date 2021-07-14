import { createTerminus } from '@godaddy/terminus';
import * as cors from 'cors';
import * as express from 'express';
import { createServer } from 'http';
import * as morgan from 'morgan';
import * as os from 'os';
import 'reflect-metadata';
import { Server } from 'typescript-rest';
import { HttpError } from 'typescript-rest/dist/server/model/errors';
import sessionCache from './auth/sessionCache';
import { dbConnect, dbDisconnect } from './dbConnection';
import { logger } from './logger';
import * as rateLimit from 'express-rate-limit';
import verificationCodes from './auth/verificationCodes';
import passwordResetLinks from './auth/passwordResetLinks';
import { rateLimiters } from './rateLimit';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8200;
const HOST = os.hostname();

const loggerStream = {
	write: (message: string) => logger.info(message.trim()),
};

const bootloader = async () => {
	const app = express();
	app.use(
		morgan(`:method :url :status :response-time\\ms`, {
			stream: loggerStream,
			skip: (req, res) => res.statusCode < 400,
		}),
	);
	app.use(cors());

	rateLimiters.forEach(({ path, options }) =>
		app.use(path, rateLimit(options)),
	);

	Server.loadServices(app, 'controllers/*', __dirname);
	Server.swagger(app, { filePath: './dist/swagger.json', endpoint: 'docs' });

	registerErrorHandler(app);

	const server = createServer(app);
	await dbConnect();
	await sessionCache.init();
	verificationCodes.start();
	passwordResetLinks.start();

	createTerminus(server, {
		healthChecks: {
			'/health-check': () => Promise.resolve('OK'),
		},
		signals: ['SIGTERM', 'SIGINT'],
		onSignal: () => {
			logger.info(`closing gracefully`);
			return Promise.all([
				passwordResetLinks.stop(),
				verificationCodes.stop(),
				sessionCache.cleanup(),
				dbDisconnect(),
			]);
		},
	});

	server.listen(PORT, () => {
		logger.info(`Server ready http://${HOST}:${PORT}`);
	});
};

const registerErrorHandler = (app: express.Express) => {
	app.use(
		(
			err: any,
			req: express.Request,
			res: express.Response,
			next: express.NextFunction,
		) => {
			if (err instanceof HttpError) {
				if (res.headersSent) {
					return next(err);
				}
				res.set('Content-Type', 'application/json');
				res.status(err.statusCode);
				res.json({ error: err.message, code: err.statusCode });
			} else {
				next(err);
			}
		},
	);
};

bootloader().catch(err => {
	logger.error(err);
	process.exit(1);
});
