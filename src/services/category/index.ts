import express from 'express';
import { auth } from '../../middlewares/auth';

import { createCategory, getCategoryProducts, createCategoryProduct, getCategorys, deleteCategoryProduct, deleteCategory } from './controller';

const router = express.Router();
const baseURL = '/category';

router.get(`${baseURL}/productos`, auth, getCategoryProducts);
router.get(`${baseURL}/`, auth, getCategorys);
router.post(`${baseURL}/producto`, auth, createCategoryProduct);
router.post(`${baseURL}/`, auth, createCategory);
router.delete(`${baseURL}/producto/:id_product_category`, auth, deleteCategoryProduct);
router.delete(`${baseURL}/:title`, auth, deleteCategory);

export default router;
