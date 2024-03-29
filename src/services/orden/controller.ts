/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { format, addDays } from 'date-fns';
import { Request, Response } from 'express';
import Locale from 'date-fns/locale/es';
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
  geteOrdenByIdUtil,
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
import { getSelectMyAddressUtil } from '../../utils/addresses';
import { GetProductByComboUtil } from '../../utils/combo';
import { updateCiciRankUserUtil } from '../../utils';
import { NewNotificacionUtil } from '../../utils/notification';

export const newOrden = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'orden', serviceHandler: 'newOrden' });
  req.logger.info({ status: 'start' });

  try {
    const {
      paymentMethod,
      subTotal,
      shipping,
      discount,
      totalAmount,
      id_user_coupons,
      paymentId,
      idCombo,
    } = req.body;
    const user = req.user;

    if (shipping === undefined || discount === undefined || totalAmount === 0) {
      const response = { status: 'No data orden provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const cartPenndig = await getStatusCartUserUtil(user.idUser, 'Pending');

    if (cartPenndig.length > 1 && !idCombo) {
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
      idCart: idCombo ? null : cartPenndig[0].idCart,
      idUser: user.idUser,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      update_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status: paymentMethod === 'Bank' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || null,
      subTotal,
      shipping,
      discount,
      totalAmount,
      id_user_coupons: id_user_coupons || null,
      paymentId: paymentId || null,
      qualified: false,
      numberOfOrder: lasOrden.length ? lasOrden[0].lasNumberOfOrder + 1 : 1,
      idCombo: idCombo || null,
    };

    await createOrdenUtil(Orden);

    if (Orden.idCart) {
      await UpdateStatusCart(Orden.idCart, 'Complete');
      const cartProducts = await getCartProductUtil(Orden.idCart);
      cartProducts.map(async item => await updateAddSoldProductUtil(item.quantity, item.idProduct));

      if (Orden.status === 'Paid') {
        const pts = Number((5 + Orden.totalAmount).toFixed(0));
        await updateCiciRankUserUtil(pts, user.idUser);

        cartProducts.map(
          async item => await updateSubtractAvailabledProductUtil(item.quantity, item.idProduct),
        );
      }
    }

    if (Orden.status === 'Paid') {
      let DateDelivery: Date | string = addDays(new Date(Orden.created_at), 3);
      DateDelivery = format(new Date(DateDelivery), 'PPPP', { locale: Locale });

      const SelecrAddress = await getSelectMyAddressUtil(user.idUser);
      let Address = '';

      if (SelecrAddress.length) {
        Address = `(${SelecrAddress[0].title}) - ${SelecrAddress[0].address}`;
      } else {
        Address = 'NO ESPECIFICADO';
      }

      await SendEmail({
        to: user.email,
        subject: 'Orden confirmada',
        text: '',
        html: ConfirOrden(
          Number(Orden.discount),
          Orden.numberOfOrder,
          Orden.shipping,
          Orden.id_user_coupons,
          Orden.totalAmount,
          DateDelivery,
          Address,
        ),
      });

      await NewNotificacionUtil({
        idNotification: uuidv4(),
        idUser: user.idUser,
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        isRead: false,
        title: 'Orden confirmada',
        text: `Tu orden se realizo correctamente, sigue la orden en la seccion de mis pedidos.`,
        link: 'https://cici.beauty/mis-pedidos',
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
    const { idOrden } = req.params;
    const me = req.user;

    const ShippingProduct = await getShippingAndOrderDetailsUtil(me.idUser, idOrden);

    const DetailOrden = await Promise.all(
      ShippingProduct.map(async orden => {
        let products;

        if (orden.idCart) {
          products = await getProductCartUtil(orden.idCart);
        }

        if (orden.idCombo) {
          products = await GetProductByComboUtil(orden.idCombo);
        }

        orden.entregado_el = format(new Date(orden.entregado_el), 'yyyy-MM-dd HH:mm');
        orden.ordenado_el = format(new Date(orden.ordenado_el), 'yyyy-MM-dd HH:mm');
        orden.enviado_el = format(new Date(orden.enviado_el), 'yyyy-MM-dd HH:mm');

        return {
          ...orden,
          products,
        };
      }),
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

    if (status === 'Paid') {
      const Orden = await geteOrdenByIdUtil(idOrden);

      let DateDelivery: Date | string = addDays(new Date(Orden[0].created_at), 3);
      DateDelivery = format(new Date(DateDelivery), 'PPPP', { locale: Locale });

      const SelecrAddress = await getSelectMyAddressUtil(me.idUser);
      let Address = '';

      if (SelecrAddress.length) {
        Address = `(${SelecrAddress[0].title}) - ${SelecrAddress[0].address}`;
      } else {
        Address = 'NO ESPECIFICADO';
      }

      await SendEmail({
        to: me.email,
        subject: 'Orden confirmada',
        text: '',
        html: ConfirOrden(
          Number(Orden[0].discount),
          Orden[0].numberOfOrder,
          Orden[0].shipping,
          Orden[0].id_user_coupons,
          Orden[0].totalAmount,
          DateDelivery,
          Address,
        ),
      });

      await NewNotificacionUtil({
        idNotification: uuidv4(),
        idUser: me.idUser,
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        isRead: false,
        title: 'Orden confirmada',
        text: `Tu orden se realizo correctamente, sigue la orden en la seccion de mis pedidos.`,
        link: 'https://cici.beauty/mis-pedidos',
      });
    }

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
