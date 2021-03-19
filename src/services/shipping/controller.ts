import { format } from 'date-fns';
import { Request, Response } from 'express';
// import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Shipping } from '../../models/shipping';
import { createShippingUtil } from '../../utils/shipping';

export const newShipping = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'newShipping' });
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