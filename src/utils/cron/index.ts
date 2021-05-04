import cron from 'node-cron'
import { CartAbandonado, getProductCartUtil } from '../cart';
import { updateExpireCouponsUtil } from '../coupons';
import { SendEmail } from '../email/send';
import { TemplateAbandonedCart } from '../email/template/abandonedCart';
import { updateOfferExpiresProductUtil } from '../products';

export const CronMidnight = () => {
    cron.schedule('0 0 0 * * *', async () => {
        await updateExpireCouponsUtil();
        await updateOfferExpiresProductUtil();
        await AbandonedCart();

        console.group('Validar cupones expirados', 'validar productos con descuentos expirados', 'Email para Carrito abandonado');
    });
}

const AbandonedCart = async () => {
    const cartUser = await CartAbandonado();

        if(cartUser.length){
            await Promise.all(
                cartUser.map(async cart => {
                    const products = await getProductCartUtil(cart.idCart);

                    await SendEmail({
                        to: cart.email,
                        subject: `${cart.userName} | Tus productos esperan por ti`,
                        text:'',
                        html: TemplateAbandonedCart(products),
                    });
                })
            )
        }
}