import express from 'express';
import { auth } from '../../middlewares/auth';

import {
  createCombo,
  getCombosAll,
  addProductCombo,
  deleteProductCombo,
  deleteCombo,
} from './controller';

const router = express.Router();
const baseURL = '/combo';

router.post(`${baseURL}/addProduct`, auth, addProductCombo);
router.post(`${baseURL}/`, auth, createCombo);
router.get(`${baseURL}/all`, auth, getCombosAll);
router.delete(`${baseURL}/product/:idProduct`, auth, deleteProductCombo);
router.delete(`${baseURL}/:idCombo`, auth, deleteCombo);

export default router;
