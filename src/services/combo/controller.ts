import { Request, Response } from 'express';
import { Combo } from '../../models/combo';
import { v4 as uuidv4 } from 'uuid';
import { GetComboExistUtil, NewComboUtil } from '../../utils/combo';
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
      active: active || false,
      sold: sold || 0,
    };

    await NewComboUtil(data);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
