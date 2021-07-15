import { format } from 'date-fns';
import Locale from 'date-fns/locale/es';
import { OfferTime } from '../models/offerTime';
import { getProductsOfferTimeUtil } from '../utils/offerTime';

export const SchemaTime = async (OfferTimes: OfferTime[], formatFinish?: boolean) => {
  return await Promise.all(
    OfferTimes.map(async time => {
      time.created_at = format(new Date(time.created_at), 'PPPP', { locale: Locale });

      if (formatFinish) {
        time.finish_at = format(new Date(time.finish_at), 'PPPP', { locale: Locale });
      }

      const productos = await getProductsOfferTimeUtil(time.idOfferTime);

      productos.map(
        product => (product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd')),
      );

      return {
        ...time,
        productos,
      };
    }),
  );
};
