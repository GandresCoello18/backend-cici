/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Orden } from '../../models/orden';
import {
  getCartProductUtil,
  getProductCartUtil,
  getStatusCartUserUtil,
  UpdateStatusCart,
} from '../../utils/cart';
import {
  createOrdenUtil,
  getCountOrdensByUserUtil,
  geteOrdensByUserUtil,
  geteOrdensUtil,
  getLasNmberOfOrdenUtil,
  UpdateStatusOrdenUtil,
  Update_atOrdenUtil,
} from '../../utils/orden';
import { updateStatusCouponsUtil } from '../../utils/coupons';
import { SchemaOrder, SchemaStatusOrder } from '../../helpers/Order';
import { geteShippingByOrdenUtil, getShippingAndOrderDetailsUtil } from '../../utils/shipping';
import {
  updateAddSoldProductUtil,
  updateSubtractAvailabledProductUtil,
} from '../../utils/products';
import { getStatisticsOrderUtil } from '../../utils/statistics';
import { SendEmail } from '../../utils/email/send';
import { ConfirOrden } from '../../utils/email/template/confirOrden';

export const newOrden = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'newOrden' });
  req.logger.info({ status: 'start' });

  try {
    const { paymentMethod, shipping, discount, totalAmount, id_user_coupons, paymentId } = req.body;
    const user = req.user;

    if (shipping === undefined || discount === undefined || totalAmount === 0) {
      const response = { status: 'No data orden provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const cartPenndig = await getStatusCartUserUtil(user.idUser, 'Pending');

    if (cartPenndig.length > 1) {
      const response = { status: 'Error en escoger el carrito de compras' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (id_user_coupons) {
      await updateStatusCouponsUtil(id_user_coupons, 'Usado');
    }

    const lasOrden = await getLasNmberOfOrdenUtil();

    const Orden: Orden = {
      idOrder: uuidv4(),
      idCart: cartPenndig[0].idCart,
      idUser: user.idUser,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      update_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status: paymentMethod === 'Bank' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || null,
      shipping,
      discount,
      totalAmount,
      id_user_coupons: id_user_coupons || null,
      paymentId: paymentId || null,
      qualified: false,
      numberOfOrder: lasOrden[0].lasNumberOfOrder + 1,
    };

    await createOrdenUtil(Orden);
    await UpdateStatusCart(Orden.idCart, 'Complete');

    const cartProducts = await getCartProductUtil(Orden.idCart);
    cartProducts.map(async item => await updateAddSoldProductUtil(item.quantity, item.idProduct));
    const quantityProduct = cartProducts.reduce((a, b) => a + b.quantity, 0);

    if (Orden.status === 'Paid') {
      cartProducts.map(
        async item => await updateSubtractAvailabledProductUtil(item.quantity, item.idProduct),
      );

      await SendEmail({
        to: user.idUser,
        subject: 'Orden confirmada | Cici beauty place',
        text: '',
        html: ConfirOrden(
          quantityProduct,
          Orden.numberOfOrder,
          Orden.shipping,
          Orden.id_user_coupons,
          Orden.totalAmount,
        ),
      });
    }

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getOrdenStatus = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrdenStatus' });
  req.logger.info({ status: 'start' });

  try {
    const user = req.user;
    let { status } = req.params;
    const page = req.query.page as string;
    let pages = 0;
    let start = 0;

    if (!status) {
      const response = { status: 'No data orden status provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (Number(page)) {
      const totalOrden = await getCountOrdensByUserUtil(
        user.idUser,
        status === 'Pendiente de pago' ? 'Pending' : 'Paid',
      );
      pages = totalOrden[0].totalOrden;

      if (Number(page) > 1) {
        start = Math.trunc((Number(page) - 1) * 5);
      }
    }

    let responseOrden;

    switch (status) {
      case 'Pendiente de pago':
        status = 'Pending';
        responseOrden = await SchemaStatusOrder(user.idUser, status, start);
        break;
      case 'Pendiente de envio':
        status = 'Paid';
        const OrdenPaidPendingShippin = await SchemaStatusOrder(user.idUser, status, start);

        responseOrden = await Promise.all(
          OrdenPaidPendingShippin.map(async orden => {
            const IsShipping = await geteShippingByOrdenUtil(orden.idOrder);
            return IsShipping.length ? null : orden;
          }),
        );

        responseOrden = responseOrden.filter(orden => orden !== null);
        break;
      case 'Pendiente de entrega':
        status = 'Paid';
        const OrdenPaid = await SchemaStatusOrder(user.idUser, status, start);

        responseOrden = await Promise.all(
          OrdenPaid.map(async orden => {
            const Shipping = await geteShippingByOrdenUtil(orden.idOrder);

            if (Shipping[0].status === 'Delivered') {
              return null;
            }

            return orden;
          }),
        );

        responseOrden = responseOrden.filter(orden => orden !== null);
        break;
    }

    return res.status(200).json({ ordenes: responseOrden || [], pages });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getOrders = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrders' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const idPago = req.query.idPago as string;
    const page = req.query.page as string;
    let pages = 0;
    let start = 0;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (Number(page)) {
      const totalOrden = await getStatisticsOrderUtil();
      pages = Math.trunc(totalOrden[0].total / 15);

      if (Number(page) > 1) {
        start = Math.trunc((Number(page) - 1) * 15);
      }
    }

    const ordenes = await geteOrdensUtil(idPago || undefined, start);
    const responseOrden = await SchemaOrder(ordenes);

    return res.status(200).json({ ordenes: responseOrden, pages });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

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
        };
      }),
    );

    DetailOrden.map(
      envio => (envio.entregado_el = format(new Date(envio.entregado_el), 'yyyy-MM-dd HH:mm')),
    );
    DetailOrden.map(
      envio => (envio.ordenado_el = format(new Date(envio.ordenado_el), 'yyyy-MM-dd HH:mm')),
    );
    DetailOrden.map(
      envio => (envio.enviado_el = format(new Date(envio.enviado_el), 'yyyy-MM-dd HH:mm')),
    );

    return res.status(200).json({ DetailOrden: DetailOrden[0] });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'getOrdersByUser' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idUser } = req.params;

    if (!me.isAdmin || me.isBanner) {
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
};

export const UpdateStatusOrder = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'UpdateStatusOrder' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idOrden } = req.params;
    const { status } = req.body;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!status) {
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
};
