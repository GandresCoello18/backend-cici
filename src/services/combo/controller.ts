import { Request, Response } from 'express';
import { Combo, ComboProduct } from '../../models/combo';
import { v4 as uuidv4 } from 'uuid';
import Locale from 'date-fns/locale/es';
import {
  AddComboProductUtil,
  DeleteComboUtil,
  DeleteProductComboUtil,
  GetComboExistUtil,
  GetComboProductExistUtil,
  GetCombosActiveUtil,
  GetCombosUtil,
  GetComboUtil,
  GetProductByComboUtil,
  NewComboUtil,
  UpdateComboUtil,
} from '../../utils/combo';
import { format } from 'date-fns';
import { SchemaCombo } from '../../helpers/Combo';
import { getProductReviewUtil } from '../../utils/products';
import { ProductReviewByUser } from '../../models/products';

export const createCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'createCombo' });
  req.logger.info({ status: 'start' });

  try {
    const { name, price, discount, active, sold } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!name || active === undefined) {
      const response = { status: 'No data combo provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const ExistCombo = await GetComboExistUtil(name);

    if (ExistCombo.length) {
      const response = { status: 'Esta combo ya existe' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const data: Combo = {
      idCombo: uuidv4(),
      name,
      price: price || 0,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      discount: discount || 0,
      active: active === 'true' || false,
      sold: sold || 0,
    };

    await NewComboUtil(data);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getCombosAll = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'getCombosAll' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const combosAll = await GetCombosUtil();

    const combos = await SchemaCombo(combosAll);

    combos.map(
      combo =>
        combo !== null && (combo.created_at = format(new Date(combo.created_at), 'yyyy-MM-dd')),
    );

    return res.status(200).json({ combos });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getReviewCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'getReviewCombo' });
  req.logger.info({ status: 'start' });

  try {
    const { idCombo } = req.params;

    if (!idCombo) {
      const response = { status: 'No id combo provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const comboProducts = await GetProductByComboUtil(idCombo);
    const data: ProductReviewByUser[] = [];

    const reviews = await Promise.all(
      comboProducts.map(async product => {
        const reviewProduct = await getProductReviewUtil(product.idProducts);

        reviewProduct.map(
          review =>
            (review.created_at = format(new Date(review.created_at), 'PPPP', { locale: Locale })),
        );

        return reviewProduct;
      }),
    );

    reviews.map(review => review.map(item => data.push(item)));

    return res.status(200).json({ reviews: data });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'getCombo' });
  req.logger.info({ status: 'start' });

  try {
    const { idCombo } = req.params;

    if (!idCombo) {
      const response = { status: 'No id Combo provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const combo = await GetComboUtil(idCombo);

    if (!combo.length) {
      return res.status(200).json(undefined);
    }

    const ThisCombo = await SchemaCombo(combo, true);

    const FilterCombo = ThisCombo.filter(combo => combo !== null);

    FilterCombo.map(
      combo =>
        combo !== null &&
        (combo.created_at = format(new Date(combo.created_at), 'PPPP', { locale: Locale })),
    );

    return res.status(200).json({ ThisCombo: ThisCombo[0] });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getCombos = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'getCombos' });
  req.logger.info({ status: 'start' });

  try {
    const combosAll = await GetCombosActiveUtil(1);
    const combos = await SchemaCombo(combosAll, true);

    const FilterCombo = combos.filter(combo => combo !== null);

    FilterCombo.map(
      combo =>
        combo !== null &&
        (combo.created_at = format(new Date(combo.created_at), 'PPPP', { locale: Locale })),
    );

    return res.status(200).json({ combos: FilterCombo });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const addProductCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'addProductCombo' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idProduct, idCombo } = req.body;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const ExistProduct = await GetComboProductExistUtil(idCombo, idProduct);

    if (ExistProduct.length) {
      const response = { status: 'Este producto ya existe en este combo' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const data: ComboProduct = {
      idComboProduct: uuidv4(),
      idCombo,
      idProduct,
    };

    await AddComboProductUtil(data);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const updateCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'updateCombo' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idCombo } = req.params;
    const { name, price, discount, active } = req.body;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idCombo || !name || !price || !discount || active === undefined) {
      const response = { status: 'No id Combo provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await UpdateComboUtil(idCombo, name, price, discount, active);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteProductCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'deleteProductCombo' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idProduct } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idProduct) {
      const response = { status: 'No id Product provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await DeleteProductComboUtil(idProduct);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteCombo = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'combo', serviceHandler: 'deleteCombo' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idCombo } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idCombo) {
      const response = { status: 'No id combo provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await DeleteComboUtil(idCombo);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
