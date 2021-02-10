import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Orden } from '../../models/orden';
import { getStatusCartUserUtil } from '../../utils/cart';
import { createOrdenUtil } from '../../utils/orden';

export const newOrden = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'newOrden' });
    req.logger.info({ status: 'start' });

    try {
        const { paymentMethod, shipping, discount, totalAmount, id_user_coupons, paymentId } = req.body
        const user = req.user

        if(shipping === undefined || discount === undefined || totalAmount === 0){
            const response = { status: 'No data orden provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const cartPenndig = await getStatusCartUserUtil(user.idUser, 'Pendiente')

        if(cartPenndig.length > 1){
            const response = { status: 'Error en escoger el carrito de compras' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const Orden: Orden = {
            idOrder: uuidv4(),
            idCart: cartPenndig[0].idCart,
            idUser: user.idUser,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            update_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            status: paymentId ? 'Paid': 'Pending',
            paymentMethod: paymentMethod || null,
            shipping,
            discount,
            totalAmount,
            id_user_coupons: id_user_coupons || null,
            paymentId: paymentId || null,
        }

        await createOrdenUtil(Orden)

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
