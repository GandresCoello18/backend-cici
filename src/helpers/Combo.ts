import { format } from 'date-fns';
import { Combo } from '../models/combo';
import { GetProductByComboUtil } from '../utils/combo';
import { BASE_API_IMAGES_CLOUDINNARY } from './url';

export const SchemaCombo = async (combos: Combo[], onlyPhotos?: boolean) => {
  return await Promise.all(
    combos.map(async combo => {
      const products = await GetProductByComboUtil(combo.idCombo);
      const photos: { source: string }[] = [];

      if (onlyPhotos) {
        products.map(product =>
          photos.push({ source: `${BASE_API_IMAGES_CLOUDINNARY}/${product.source}` }),
        );

        return {
          ...combo,
          photos,
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
