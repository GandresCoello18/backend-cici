import express from 'express';

import { profileInstagram, instagramAuth } from './controller';

const router = express.Router();
const baseURL = '/instagram';

router.get(`${baseURL}/profile`, profileInstagram);
router.get(`${baseURL}/auth`, instagramAuth);

export default router;
