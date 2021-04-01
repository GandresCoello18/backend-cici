import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Orden } from '../../models/orden';
import { getProductCartUtil, getStatusCartUserUtil, UpdateStatusCart } from '../../utils/cart';
import { createOrdenUtil, geteOrdensByUserUtil, geteOrdensUtil, UpdateStatusOrdenUtil, Update_atOrdenUtil } from '../../utils/orden';
import { updateStatusCouponsUtil } from '../../utils/coupons';
import { SchemaOrder, SchemaStatusOrder } from '../../helpers/Order';
import { geteShippingByOrdenUtil, getShippingAndOrderDetailsUtil } from '../../utils/shipping';

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

        switch(status){
            case 'Pendiente de pago':
                status = 'Pending'
                responseOrden = await SchemaStatusOrder(user.idUser, status);
                break
            case 'Pendiente de envio':
                status = 'Paid'
                responseOrden = await SchemaStatusOrder(user.idUser, status);
                break
            case 'Pendiente de entrega':
                status = 'Paid'
                const OrdenPaid = await SchemaStatusOrder(user.idUser, status);

                responseOrden = await Promise.all(
                    OrdenPaid.map(async orden => {
                        const IsShipping = await geteShippingByOrdenUtil(orden.idOrder);
                        return IsShipping.length ? orden : null;
                    })
                )

                responseOrden = responseOrden.filter(orden => orden !== null);
                break
        }

        return res.status(200).json({ ordenes: responseOrden || [] });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getOrders = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrders' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user;
        const idPago = req.query.idPago as string;

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const ordenes = await geteOrdensUtil(idPago || undefined);
        const responseOrden = await SchemaOrder(ordenes);

        return res.status(200).json({ ordenes: responseOrden });
    } catch (error) {
        console.log(error.message);
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getOrdenDetails = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrdenDetails' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user;

        const ShippingProduct = await getShippingAndOrderDetailsUtil(me.idUser);

        const DetailOrden = await Promise.all(
            ShippingProduct.map(async orden => {
                const cartProduct = await getProductCartUtil(orden.idCart);

                return {
                    ...orden,
                    products: cartProduct,
                }
            })
        )

        DetailOrden.map(envio => envio.entregado_el = format(new Date(envio.entregado_el), 'yyyy-MM-dd HH:mm'));
        DetailOrden.map(envio => envio.ordenado_el = format(new Date(envio.ordenado_el), 'yyyy-MM-dd HH:mm'));
        DetailOrden.map(envio => envio.enviado_el = format(new Date(envio.enviado_el), 'yyyy-MM-dd HH:mm'));

        console.log(DetailOrden);

        return res.status(200).json({ DetailOrden: DetailOrden[0] });
    } catch (error) {
        console.log(error.message);
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getOrdersByUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrdersByUser' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user;
        const { idUser } = req.params;

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const ordenes = await geteOrdensByUserUtil(idUser);
        const responseOrden = await SchemaOrder(ordenes);

        return res.status(200).json({ ordenes: responseOrden });
    } catch (error) {
        console.log(error.message);
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const UpdateStatusOrder = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'orden', serviceHandler: 'UpdateStatusOrder' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user;
        const { idOrden } = req.params;
        const { status } = req.body;

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(!status){
            const response = { status: 'No status provider' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await UpdateStatusOrdenUtil(idOrden, status);
        await Update_atOrdenUtil(idOrden, format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

        return res.status(200).json();
    } catch (error) {
        console.log(error.message);
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
