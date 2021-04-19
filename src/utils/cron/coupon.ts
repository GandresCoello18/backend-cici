import cron from 'node-cron'
import { updateExpireCouponsUtil } from '../coupons';

export const ExpiredCoupon = () => {
    cron.schedule('0 0 0 * * *', async () => {
        await updateExpireCouponsUtil();
        console.log('Ejecutado a la media noche: 00:00, (Calcula la fecha de expiracion de los cupones distintos de expirados)');
    });
}