import cron from 'node-cron'
import { updateExpireCouponsUtil } from '../coupons';
import { updateOfferExpiresProductUtil } from '../products';

export const CronMidnight = () => {
    cron.schedule('0 0 0 * * *', async () => {
        await updateExpireCouponsUtil();
        await updateOfferExpiresProductUtil();
        console.log('Validar cupones expirados, validar productos con descuentos expirados');
    });
}