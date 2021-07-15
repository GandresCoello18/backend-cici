/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { Request, Response } from 'express';
// import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Shipping } from '../../models/shipping';
import { getUserUtil } from '../../utils';
import { getMyAddressUtil } from '../../utils/addresses';
import { getProductCartUtil } from '../../utils/cart';
import { GetProductByComboUtil } from '../../utils/combo';
import { SendEmail } from '../../utils/email/send';
import { PackageSent } from '../../utils/email/template/packageSent';
import { QualifyOrder } from '../../utils/email/template/qualifyOrder';
import { NewNotificacionUtil } from '../../utils/notification';
import { geteOrdenUtil } from '../../utils/orden';
import {
  createShippingUtil,
  getCountShippingByUserUtil,
  getCountShippingUtil,
  geteShippingUtil,
  getShippingProductsUtil,
  getShippingUtil,
  updateStatusShippingUtil,
} from '../../utils/shipping';

export const newShipping = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'newShipping' });
  req.logger.info({ status: 'start' });

  try {
    const { idOrder, guide, method } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idOrder) {
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
    };

    await createShippingUtil(shipping);

    const Orden = await geteOrdenUtil(shipping.idOrder, 'Paid');
    const user = await getUserUtil({ idUser: Orden[0].idUser });
    const AddressUser = await getMyAddressUtil(user[0].idUser);

    const AddressSelect = AddressUser.find(item => item.selected);

    await SendEmail({
      to: user[0].email,
      subject: 'Tu paquete fue enviado | Cici beauty place',
      text: '',
      html: PackageSent(user[0].userName, shipping.guide, AddressSelect),
    });

    await NewNotificacionUtil({
      idNotification: uuidv4(),
      idUser: user[0].idUser,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      isRead: false,
      title: 'Tu paquete fue enviado',
      text: `Tu orden esta en camino, revisa tu email o en la sección de mi pedidos (pendiente de entrega).`,
      link: 'https://cici.beauty/mis-pedidos',
    });

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getShipping = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'getShipping' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const idPago = req.query.idPago as string;
    const page = req.query.page as string;
    let pages = 0;
    let start = 0;
    let shipping: Shipping[] = [];

    if (Number(page)) {
      const totalOrden = me.isAdmin
        ? await getCountShippingUtil()
        : await getCountShippingByUserUtil(me.idUser);
      pages = totalOrden[0].totalShipping;

      if (Number(page) > 1) {
        start = Math.trunc((Number(page) - 1) * (me.isAdmin ? 15 : 5));
      }
    }

    console.log(req.hostname);

    if (me.isAdmin && (req.hostname === 'dashboard.cici.beauty' || req.hostname === 'localhost')) {
      shipping = await getShippingUtil(idPago || undefined, start);
    } else {
      const ShippingProduct = await getShippingProductsUtil(me.idUser, start);

      shipping = await Promise.all(
        ShippingProduct.map(async orden => {
          let cart: any[] = [];

          if (orden.idCart) {
            cart = await getProductCartUtil(orden.idCart);
          }

          if (orden.idCombo) {
            cart = await GetProductByComboUtil(orden.idCombo);
          }

          return {
            ...orden,
            titleProduct: cart[0].title,
            sourcesProduct: cart[0].source,
            products: cart.length - 1,
          };
        }),
      );
    }

    shipping.map(
      envio => (envio.created_at = format(new Date(envio.created_at), 'yyyy-MM-dd HH:mm:ss')),
    );
    shipping.map(
      envio => (envio.update_at = format(new Date(envio.update_at), 'yyyy-MM-dd HH:mm:ss')),
    );

    return res.status(200).json({ shipping, pages });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const updateStatusShipping = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'shipping', serviceHandler: 'updateStatusShipping' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idShipping } = req.params;
    const { status } = req.body;

    if (!me.isAdmin) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idShipping || !status) {
      const response = { status: 'No provider id shipping or status' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await updateStatusShippingUtil(status, format(new Date(), 'yyyy-MM-dd HH:mm:ss'), idShipping);

    const shipping = await geteShippingUtil(idShipping);
    const order = await geteOrdenUtil(shipping[0].idOrder, 'Paid');

    if (order.length) {
      const user = await getUserUtil({ idUser: order[0].idUser });

      if (status === 'Delivered') {
        await SendEmail({
          to: user[0].email,
          subject: 'Tu orden acaba de llegar | Cici beauty place',
          text: '',
          html: QualifyOrder(user[0].userName, order[0].idOrder),
        });

        await NewNotificacionUtil({
          idNotification: uuidv4(),
          idUser: user[0].idUser,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          isRead: false,
          title: 'Tu orden acaba de llegar',
          text: `Sabemos que ya tienes tu paquete y esperamos que lo disfrutes, puedes acceder a la sección de mis comprar y calificar el producto.`,
          link: 'https://cici.beauty/mis-compras',
        });
      }
    }

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
