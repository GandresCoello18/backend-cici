import express from 'express';
import { auth } from '../../middlewares/auth';

import {
  addNotification,
  getNotifications,
  ReadNotification,
  ReadAllNotification,
} from './controller';

const router = express.Router();
const baseURL = '/notification';

router.post(`${baseURL}`, auth, addNotification);
router.get(`${baseURL}`, auth, getNotifications);
router.put(`${baseURL}/read/:idNotification`, auth, ReadNotification);
router.put(`${baseURL}/readAll`, auth, ReadAllNotification);

export default router;
