import { format } from "date-fns";
import { Orden, productOrden } from "../models/orden";
import { User } from "../models/users";
import Locale from 'date-fns/locale/es'
import { getUserUtil } from "../utils";
import { getProductCartUtil } from "../utils/cart";

export const SchemaOrder = async (ordenes: Orden[]) => {
    const responseOrden = await Promise.all(
        ordenes.map(async orden => {

            const product: productOrden[] = await getProductCartUtil(orden.idCart)
            const user: User[] = await getUserUtil({ idUser: orden.idUser });

            return {
                idOrder: orden.idOrder,
                created_at: format(new Date(orden.created_at), 'PPPP', {locale: Locale}),
                update_at: format(new Date(orden.update_at), 'PPPP', {locale: Locale}),
                shipping: orden.shipping,
                discount: orden.discount,
                status: orden.status,
                paymentMethod: orden.paymentMethod,
                paymentId: orden.paymentId,
                totalAmount: orden.totalAmount,
                id_user_coupons: orden.id_user_coupons,
                product,
                user: {
                    avatar: user[0].avatar,
                    userName: user[0].userName,
                    email: user[0].email,
                }
            }
        })
    )

    return responseOrden;
}