import { createTransport } from 'nodemailer';
import { logger } from '../logger';
require('dotenv').config();

if (!process.env.LOCAL_IP) {
	throw new Error('asset-service URL missing');
}
const NO_REPLAY_EMAIL = 'noreplay@l2hestia.com';

const transporter = createTransport({
	pool: true,
	host: process.env.LOCAL_IP,
	port: 25,
	secure: false,
});

const sendEmailCode = async (code: number, email: string) => {
	transporter.sendMail(
		{
			from: { address: NO_REPLAY_EMAIL, name: 'L2 Hestia' },
			to: email,
			subject: 'L2 Hestia: Verification Code',
			text: `Your verification code: ${code}

Regards,
L2 Hestia`,
		},
		err => {
			if (err) {
				logger.error(err);
			}
		},
	);
};

const sendPassResetLink = async (link: string, email: string) => {
	transporter.sendMail(
		{
			from: { address: NO_REPLAY_EMAIL, name: 'L2 Hestia' },
			to: email,
			subject: 'L2 Hestia: Password Reset',
			text: `Click here to reset your password: ${link}

Regards,
L2 Hestia`,
		},
		err => {
			if (err) {
				logger.error(err);
			}
		},
	);
};

export default {
	sendEmailCode,
	sendPassResetLink,
};
