import express from 'express';

import { newTimeMessage, getTimeMessage, resendTimeMessage } from './controller';

const router = express.Router();
const baseURL = '/timeMessage';

router.post(`${baseURL}/`, newTimeMessage);
router.post(`${baseURL}/resend`, resendTimeMessage);
router.get(`${baseURL}/:id_time_message`, getTimeMessage);

export default router;
