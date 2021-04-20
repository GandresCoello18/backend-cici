import express from 'express';
import multer from 'multer';
import { auth } from '../../middlewares/auth';
import { storage } from '../../utils/multer';

import { getMe, getUser, getUsers, getUserName, crerateUser, login, updateMeUser, updatePasswordEmail, updatePasswordUser, updateAvatardUser, deleteUser } from './controller';

const router = express.Router();
const baseURL = '/users';

router.get(`${baseURL}/me`, auth, getMe);
router.get(`${baseURL}/invite/:username`, getUserName);
router.get(`${baseURL}/:idUser`, auth, getUser);
router.get(`${baseURL}/`, auth, getUsers);
router.post(`${baseURL}/`, crerateUser);
router.post(`${baseURL}/login`, login);
router.put(`${baseURL}/`, auth, updateMeUser);
router.put(`${baseURL}/reset-password/:email`, updatePasswordEmail);
router.put(`${baseURL}/password`, auth, updatePasswordUser);
router.put(`${baseURL}/avatar`, auth, multer({ storage }).single('avatar'), updateAvatardUser);
router.delete(`${baseURL}/:idUser`, auth, deleteUser);

export default router;
