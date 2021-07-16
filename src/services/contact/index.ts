import express from 'express';
import { auth } from '../../middlewares/auth';

import { createSms, getSms, replyMessage, deleteSms } from './controller';

const router = express.Router();
const baseURL = '/messages';

router.get(`${baseURL}/`, auth, getSms);
router.post(`${baseURL}/answer`, auth, replyMessage);
router.post(`${baseURL}/`, createSms);
router.delete(`${baseURL}/:idContact`, auth, deleteSms);

export default router;
