import express from 'express';
import { auth } from '../../middlewares/auth';

import { newLottery, getLotterys, WinnerLotterys, resetLotterys } from './controller';

const router = express.Router();
const baseURL = '/lottery';

router.post(`${baseURL}/`, auth, newLottery);
router.get(`${baseURL}/winner/:idLoterry`, auth, WinnerLotterys);
router.get(`${baseURL}/`, auth, getLotterys);
router.put(`${baseURL}/reset/:idLoterry`, auth, resetLotterys);

export default router;
