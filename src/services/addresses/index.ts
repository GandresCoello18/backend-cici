import express from 'express';
import { auth } from '../../middlewares/auth';

import { getMyAddress, getAddressByUser, newAddress, deleteMyAddress, selectedAddress } from './controller';

const router = express.Router();
const baseURL = '/addresses';

router.get(`${baseURL}/`, auth, getMyAddress);
router.get(`${baseURL}/:idUser`, getAddressByUser);
router.post(`${baseURL}/`, newAddress);
router.put(`${baseURL}/selected/:title`, auth, selectedAddress);
router.delete(`${baseURL}/:title`, auth, deleteMyAddress);

export default router;
