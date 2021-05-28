import { Request, Response } from 'express';
import {
  createCategoryProductUtil,
  createCategoryUtil,
  deleteCategoryProductUtil,
  deleteCategoryUtil,
  getCategoryCountProductsUtil,
  getCategorysUtil,
  getExitsCategoryUtil,
  getExitsProductCategoryUtil,
} from '../../utils/category';

export const createCategory = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'createCategory' });
  req.logger.info({ status: 'start' });

  try {
    const { title } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!title) {
      const response = { status: 'No title provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const ExistCategory = await getExitsCategoryUtil(title);

    if (ExistCategory.length) {
      const response = { status: 'Esta categoria ya existe' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await createCategoryUtil(title);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const createCategoryProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'createCategoryProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { categorys, idProduct } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (categorys.length === 0 || !idProduct) {
      const response = { status: 'No id Product or categorys provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await Promise.all(
      categorys.map(async (idCategory: number) => {
        const existProductCategory = await getExitsProductCategoryUtil(
          Number(idCategory),
          idProduct,
        );

        if (existProductCategory.length === 0) {
          await createCategoryProductUtil(Number(idCategory), idProduct);
        }
      }),
    );

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getCategorys = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'getCategorys' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const categorys = await getCategorysUtil();

    return res.status(200).json({ categorys });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getCategoryProducts = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'getCategoryProducts' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const category = await getCategorysUtil();

    const categoryProducts = await Promise.all(
      category.map(async cate => {
        const count = await getCategoryCountProductsUtil(cate.idCategory);

        return {
          idCategory: cate.idCategory,
          titleCategory: cate.titleCategory,
          productos: count[0].productos,
        };
      }),
    );

    return res.status(200).json({ categoryProducts });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'deleteCategory' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { title } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!title) {
      const response = { status: 'No id Contact provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteCategoryUtil(title);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteCategoryProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'category', serviceHandler: 'deleteCategoryProduct' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { id_product_category } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!id_product_category) {
      const response = { status: 'No id Contact provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteCategoryProductUtil(Number(id_product_category));

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
