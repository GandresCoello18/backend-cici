import { format } from 'date-fns';
import { Request, Response } from 'express';
// import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Shipping } from '../../models/shipping';
import { createShippingUtil, getShippingUtil, updateStatusShippingUtil } from '../../utils/shipping';

export const newShipping = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'newShipping' });
    req.logger.info({ status: 'start' });

    try {
        const { idOrder, guide, method } = req.body
        const me = req.user

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(!idOrder){
            const response = { status: 'No data id orden provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const shipping: Shipping = {
            idShipping: uuidv4(),
            idOrder,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            update_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            status: 'Sent',
            guide: guide || null,
            method: method || null,
        }

        await createShippingUtil(shipping)

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getShipping = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'getShipping' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user
        const idPago = req.query.idPago as string;

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const shipping = await getShippingUtil(idPago || undefined);

        shipping.map(envio => envio.created_at = format(new Date(envio.created_at), 'yyyy-MM-dd HH:mm:ss'));

        return res.status(200).json({ shipping });
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const updateStatusShipping = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'updateStatusShipping' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user
        const { idShipping } = req.params
        const { status } = req.body

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(!idShipping || !status){
            const response = { status: 'No provider id shipping or status' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await updateStatusShippingUtil(status, idShipping);

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}