import { format } from 'date-fns';
import { Orden, productOrden } from '../models/orden';
import { Shipping } from '../models/shipping';
import { User } from '../models/users';
import { getUserUtil } from '../utils';
import { getProductCartUtil } from '../utils/cart';
import Locale from 'date-fns/locale/es';
import { geteOrdenStatusUtil } from '../utils/orden';
import { geteShippingByOrdenUtil } from '../utils/shipping';

export const SchemaOrder = async (ordenes: Orden[]) => {
  const responseOrden = await Promise.all(
    ordenes.map(async orden => {
      const product: productOrden[] = await getProductCartUtil(orden.idCart);
      const user: User[] = await getUserUtil({ idUser: orden.idUser });
      const shipping: Shipping[] = await geteShippingByOrdenUtil(orden.idOrder);

      return {
        ...orden,
        created_at: format(new Date(orden.created_at), 'yyyy-MM-dd HH:mm:ss'),
        update_at: format(new Date(orden.update_at), 'yyyy-MM-dd HH:mm:ss'),
        sent: shipping.length > 0,
        product,
        user: {
          avatar: user[0].avatar,
          userName: user[0].userName,
          email: user[0].email,
        },
      };
    }),
  );

  return responseOrden;
};

export const SchemaStatusOrder = async (idUser: string, status: string, page: number) => {
  const ordenes = await geteOrdenStatusUtil(idUser, status, page);

  return await Promise.all(
    ordenes.map(async orden => {
      const product: productOrden[] = await getProductCartUtil(orden.idCart);

      return {
        ...orden,
        created_at: format(new Date(orden.created_at), 'PPPP', { locale: Locale }),
        product,
      };
    }),
  );
};
