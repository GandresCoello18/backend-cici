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
  GetCombosUtil,
  GetProductByComboUtil,
  NewComboUtil,
} from '../../utils/combo';
import { format } from 'date-fns';

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

    if (!name || !price || active === undefined) {
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
      price,
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

    const combos = await Promise.all(
      combosAll.map(async combo => {
        const products = await GetProductByComboUtil(combo.idCombo);

        products.map(
          product => (product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd')),
        );

        return {
          ...combo,
          products,
        };
      }),
    );

    combos.map(
      combo => (combo.created_at = format(new Date(combo.created_at), 'PPPP', { locale: Locale })),
    );

    return res.status(200).json({ combos });
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
