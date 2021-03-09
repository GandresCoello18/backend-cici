import { format } from 'date-fns';
import { Request, Response } from 'express';
import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Orden, productOrden } from '../../models/orden';
import { getProductCartUtil, getStatusCartUserUtil, UpdateStatusCart } from '../../utils/cart';
import { createOrdenUtil, geteOrdenStatusUtil } from '../../utils/orden';
import { Shipping } from '../../models/shipping';
import { geteShippingByOrdenUtil } from '../../utils/shipping';
import { updateStatusCouponsUtil } from '../../utils/coupons';

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

        const cartPenndig = await getStatusCartUserUtil(user.idUser, 'Pending')

        if(cartPenndig.length > 1){
            const response = { status: 'Error en escoger el carrito de compras' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(id_user_coupons){
            await updateStatusCouponsUtil(id_user_coupons, 'Usado');
        }

        const Orden: Orden = {
            idOrder: uuidv4(),
            idCart: cartPenndig[0].idCart,
            idUser: user.idUser,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            update_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            status: paymentMethod === 'Bank' ? 'Pending': 'Paid',
            paymentMethod: paymentMethod || null,
            shipping,
            discount,
            totalAmount,
            id_user_coupons: id_user_coupons || null,
            paymentId: paymentId || null,
        }

        await createOrdenUtil(Orden)
        await UpdateStatusCart(Orden.idCart, 'Complete')

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getOrdenStatus = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrdenStatus' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user
        let { status } = req.params

        if(!status){
            const response = { status: 'No data orden status provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        let responseOrden;
        let ordenes;

        switch(status){
            case 'Pendiente de pago':
                status = 'Pending'
                ordenes = await geteOrdenStatusUtil(user.idUser, status)

                responseOrden = await Promise.all(
                    ordenes.map(async orden => {

                        const product: productOrden[] = await getProductCartUtil(orden.idCart)

                        return {
                            idOrder: orden.idOrder,
                            created_at: format(new Date(orden.created_at), 'PPPP', {locale: Locale}),
                            status: orden.status,
                            paymentMethod: orden.paymentMethod,
                            paymentId: orden.paymentId,
                            product,
                        }
                    })
                )
                break
            case 'Pendiente de envio':
                status = 'Paid'
                ordenes = await geteOrdenStatusUtil(user.idUser, status)

                responseOrden = await Promise.all(
                    ordenes.map(async orden => {

                        const shipping: Shipping[] = await geteShippingByOrdenUtil(orden.idOrder);

                        if(shipping.length === 0){
                            const product: productOrden[] = await getProductCartUtil(orden.idCart)

                            return {
                                idOrder: orden.idOrder,
                                created_at: format(new Date(orden.created_at), 'PPPP', {locale: Locale}),
                                status: orden.status,
                                paymentMethod: orden.paymentMethod,
                                paymentId: orden.paymentId,
                                product,
                            }
                        }

                        return null
                    })
                )
                break
            case 'Pendiente de entrega':
                status = ''
                break
        }

        return res.status(200).json({ ordenes: responseOrden || [] });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
