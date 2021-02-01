import express from 'express';
import { auth } from '../../middlewares/auth';

import { getMyAddress, newAddress, deleteMyAddress, selectedAddress } from './controller';

const router = express.Router();
const baseURL = '/addresses';

router.get(`${baseURL}/`, auth, getMyAddress);
router.post(`${baseURL}/`, newAddress);
router.put(`${baseURL}/selected/:title`, auth, selectedAddress);
router.delete(`${baseURL}/:title`, auth, deleteMyAddress);

export default router;
