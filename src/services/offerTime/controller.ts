import {Request, Response} from 'express'
import { OfferTime, OfferTimeProducts } from '../../models/offerTime';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { AddProductOfferTimeUtil, deleteOfferTimeUtil, deleteProductOfferTimeUtil, editOfferTimeUtil, ExistProductOfferTimeUtil, getOfferTimeOnlyUtil, getOfferTimeUtil, NewOfferTimerUtil } from '../../utils/offerTime';
import { SchemaTime } from '../../helpers/Time';

export const createOfferTime = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'createOfferTime' });
    req.logger.info({ status: 'start' });
  
    try {
      const { finishAt, description } = req.body;
      const me = req.user;
  
      if (!me.isAdmin || me.isBanner) {
        const response = { status: 'No eres admin o estas bloqueado' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      if (!finishAt || !description) {
        const response = { status: 'No description or finish at provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const NewOffer: OfferTime = {
        idOfferTime: uuidv4(),
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        finish_at: format(new Date(finishAt), 'yyyy-MM-dd'),
        description,
        status_offer_time: 'disable',
      }

      await NewOfferTimerUtil(NewOffer);
  
      return res.status(200).json();
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(500).json();
    }
  };

  export const AddProductOfferTime = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'AddProductOfferTime' });
    req.logger.info({ status: 'start' });
  
    try {
      const { idProduct, idOfferTime } = req.body;
      const me = req.user;
  
      if (!me.isAdmin || me.isBanner) {
        const response = { status: 'No eres admin o estas bloqueado' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      if (!idProduct || !idOfferTime) {
        const response = { status: 'No id OfferTiem or id Product provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const existProduct = await ExistProductOfferTimeUtil(idProduct, idOfferTime);

      if(existProduct.length){
        const response = { status: 'Este producto ya pertenece al tiempo' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const AddProductOffer: OfferTimeProducts = {
        id_offerTime_product: uuidv4(),
        idProduct,
        idOfferTime
      }

      await AddProductOfferTimeUtil(AddProductOffer);
  
      return res.status(200).json();
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(500).json();
    }
  };

  export const getOfferTime = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'getOfferTime' });
    req.logger.info({ status: 'start' });
  
    try {
      const { idTimeOffer } = req.params;

      if (!idTimeOffer) {
        const response = { status: 'No id OfferTiem provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const OfferTimes = await getOfferTimeOnlyUtil(idTimeOffer);
      const times = await SchemaTime(OfferTimes);
  
      return res.status(200).json({ times: times[0] });
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(500).json();
    }
  };

export const getOfferTimes = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'getOfferTimes' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const OfferTimes = await getOfferTimeUtil();
    const times = SchemaTime(OfferTimes, true);

    return res.status(200).json({ times });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const editOfferTime = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'editOfferTime' });
  req.logger.info({ status: 'start' });

  try {
    const { finishAt, description, idTimeOffer } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!finishAt || !description) {
      const response = { status: 'No description or finish At provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await editOfferTimeUtil(finishAt, description, idTimeOffer);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteOfferTime = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'deleteOfferTime' });
  req.logger.info({ status: 'start' });

  try {
    const { idTimeOffer } = req.params;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idTimeOffer) {
      const response = { status: 'No id Time Offer provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteOfferTimeUtil(idTimeOffer);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteProductOfferTime = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'offerTime', serviceHandler: 'deleteProductOfferTime' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct } = req.params;
    const me = req.user;

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

    await deleteProductOfferTimeUtil(idProduct);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};