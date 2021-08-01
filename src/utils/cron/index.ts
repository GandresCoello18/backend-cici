import { format } from 'date-fns';
import cron from 'node-cron';
import Locale from 'date-fns/locale/es';
import { CartAbandonado, getProductCartUtil } from '../cart';
import { updateExpireCouponsUtil } from '../coupons';
import { SendEmail } from '../email/send';
import { TemplateAbandonedCart } from '../email/template/abandonedCart';
import { WinnerLottery } from '../email/template/winner-lottery';
import { getDateFinishUserLotteryUtil } from '../lottery';
import { UpdateExpiredOfferTimeUtil } from '../offerTime';
import { ExpiredProductHistoryUtil } from '../productHistory';
import { updateOfferExpiresProductUtil } from '../products';

export const CronNode = () => {
  cron.schedule('0 0 0 * * *', async () => {
    await updateExpireCouponsUtil();
    await updateOfferExpiresProductUtil();
    await AbandonedCart();
    await ExpiredProductHistoryUtil();
    await UpdateExpiredOfferTimeUtil();

    console.group(
      'Validar cupones expirados',
      'validar productos con descuentos expirados',
      'Email para Carrito abandonado',
      'Expired product history',
      'Expired time offert products',
    );
  });

  cron.schedule('0 0 23 * * *', async () => {
    await SendWinnerLottery();

    console.group('Envio de email a winner lottery');
  });
};

const AbandonedCart = async () => {
  const cartUser = await CartAbandonado();

  if (cartUser.length) {
    await Promise.all(
      cartUser.map(async cart => {
        const products = await getProductCartUtil(cart.idCart);

        await SendEmail({
          to: cart.email,
          subject: `${cart.userName} | Tus productos esperan por ti`,
          text: '',
          html: TemplateAbandonedCart(products),
        });
      }),
    );
  }
};

const SendWinnerLottery = async () => {
  const finish = format(new Date(), 'yyyy-MM-dd');
  const user = await getDateFinishUserLotteryUtil(finish);
  const date = format(new Date(finish), 'PPPP', { locale: Locale });

  if (user.length) {
    await SendEmail({
      to: user[0].email,
      subject: `Felicidades ${user[0].userName}`,
      text: '',
      html: WinnerLottery(user[0].numberOfLottery, date),
    });
  }
};
