import express from 'express';
import { auth } from '../../middlewares/auth';

import {
  createCombo,
  getCombosAll,
  getCombos,
  getCombo,
  addProductCombo,
  updateCombo,
  deleteProductCombo,
  deleteCombo,
} from './controller';

const router = express.Router();
const baseURL = '/combo';

router.post(`${baseURL}/addProduct`, auth, addProductCombo);
router.post(`${baseURL}/`, auth, createCombo);
router.get(`${baseURL}/all`, auth, getCombosAll);
router.get(`${baseURL}/:idCombo`, getCombo);
router.get(`${baseURL}/`, getCombos);
router.put(`${baseURL}/:idCombo`, auth, updateCombo);
router.delete(`${baseURL}/product/:idProduct`, auth, deleteProductCombo);
router.delete(`${baseURL}/:idCombo`, auth, deleteCombo);

export default router;
