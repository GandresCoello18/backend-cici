import express from 'express';

import { getProvinces } from './controller';

const router = express.Router();
const baseURL = '/provinces';

router.get(`${baseURL}/`, getProvinces);

export default router;
