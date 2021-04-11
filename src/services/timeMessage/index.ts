import express from 'express';

import { newTimeMessage, getTimeMessage } from './controller';

const router = express.Router();
const baseURL = '/timeMessage';

router.post(`${baseURL}/`, newTimeMessage);
router.get(`${baseURL}/:id_time_message`, getTimeMessage);

export default router;
