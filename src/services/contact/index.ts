import express from 'express';

import { createNewSms } from './controller';

const router = express.Router();
const baseURL = '/messages';

router.post(`${baseURL}/`, createNewSms);

export default router;
