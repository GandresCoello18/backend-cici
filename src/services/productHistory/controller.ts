import { format } from 'date-fns'
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ProductHistory } from '../../models/productHistory';
import { createProductHistoryUtil, DeleteProductHistoryUtil, existProductHistoryUtil, getProductHistoryUtil, updateProductHistoryUtil } from '../../utils/productHistory';

export const createProductHistory = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product history', serviceHandler: 'createProductHistory' });
    req.logger.info({ status: 'start' });

    try {
        const { idProduct } = req.body;
        const user = req.user

        if(!idProduct){
          const response = { status: 'No data id Product provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        const HistoryExist = await existProductHistoryUtil(idProduct, user.idUser);

        if(HistoryExist.length){
            const updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            await updateProductHistoryUtil(idProduct, user.idUser, updated_at);
            return res.status(200).json();
        }

        const history: ProductHistory = {
            idProductHistory: uuidv4(),
            idProduct: idProduct,
            idUser: user.idUser,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }

        await createProductHistoryUtil(history);

        return res.status(200).json();
    } catch (error) {
      console.log(error.message)
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const getProductsHistory = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product history', serviceHandler: 'getProductsHistory' });
    req.logger.info({ status: 'start' });

    try {
        const { limit } = req.params;
        const user = req.user

        const history = await getProductHistoryUtil(user.idUser, Number(limit));

        return res.status(200).json({ history });
    } catch (error) {
      console.log(error.message)
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const deleteProductHistory = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product history', serviceHandler: 'deleteProductHistory' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user

        await DeleteProductHistoryUtil(user.idUser);

        return res.status(200).json();
    } catch (error) {
      console.log(error.message)
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};
