import express from 'express';
import { auth } from '../../middlewares/auth';

import { getUser, getUserName, crerateUser, login, updateUser, updatePasswordUser } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/me`, auth, getUser);
router.get(`${baseURL}/invite/:username`, getUserName);
router.post(`${baseURL}/`, crerateUser);
router.post(`${baseURL}/login`, login);
router.put(`${baseURL}/`, auth, updateUser);
router.put(`${baseURL}/password`, auth, updatePasswordUser);

export default router;
