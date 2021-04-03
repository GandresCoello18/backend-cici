import express from 'express';
import { auth } from '../../middlewares/auth';

import { getStatistics, getStatisticsReviewProduct } from './controller';

const router = express.Router();
const baseURL = '/statistics';

router.get(`${baseURL}/ReviewProduct/:idProduct`, auth, getStatisticsReviewProduct);
router.get(`${baseURL}/`, auth, getStatistics);

export default router;
