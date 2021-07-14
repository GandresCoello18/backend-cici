import express from 'express';
import { auth } from '../../middlewares/auth';

import {
  newLottery,
  getLotterys,
  WinnerLotterys,
  resetLotterys,
  deleteLottery,
} from './controller';

const router = express.Router();
const baseURL = '/lottery';

router.post(`${baseURL}/`, auth, newLottery);
router.get(`${baseURL}/winner/:idLoterry`, auth, WinnerLotterys);
router.get(`${baseURL}/`, auth, getLotterys);
router.put(`${baseURL}/reset/:idLoterry`, auth, resetLotterys);
router.delete(`${baseURL}/:idLoterry`, auth, deleteLottery);

export default router;
