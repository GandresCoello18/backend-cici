/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'date-fns';
import { Combo } from '../models/combo';
import { GetProductByComboUtil } from '../utils/combo';
import { calculatePrice } from './CalculatePrice';
import { BASE_API_IMAGES_CLOUDINNARY } from './url';

export const SchemaCombo = async (combos: Combo[], addPhotos?: boolean) => {
  return await Promise.all(
    combos.map(async combo => {
      const products = await GetProductByComboUtil(combo.idCombo);
      const photos: { source: string }[] = [];
      let priceCombo = 0;

      if (!combo.price) {
        for (let i = 0; i < products.length; i++) {
          const item = products[i];

          priceCombo =
            priceCombo +
            calculatePrice({
              discount: item.discount,
              price: item.price,
            });
        }

        combo.price = priceCombo;
      }

      if (addPhotos) {
        let status = 'Completo';

        for (let i = 0; i < products.length; i++) {
          const item = products[i];

          photos.push({ source: `${BASE_API_IMAGES_CLOUDINNARY}/${item.source}` });
        }

        const productSort = products.sort((a, b) => b.available - a.available);

        if (products.some(product => product.available < 4)) {
          status = 'Incompleto';
          return null;
        }

        combo.available = productSort[productSort.length - 1].available;
        combo.status = status;

        return {
          ...combo,
          photos,
          products,
        };
      }

      products.map(
        product => (product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd')),
      );

      return {
        ...combo,
        products,
      };
    }),
  );
};
