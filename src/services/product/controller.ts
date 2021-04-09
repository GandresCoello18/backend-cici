import { format } from 'date-fns';
import Locale from 'date-fns/locale/es'
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductReviews, SourcesProduct } from '../../models/products';
import { dataBase } from '../../utils';
import { UploadMoreSourcesProduct, UploasProduct } from '../../utils/cloudinary/product';
import { UpdateQualifledOrdenUtil } from '../../utils/orden';
import { createProductReviewUtil, createProductSourcesUtil, createProductUtil, deleteProductUtil, getProductExistUtil, getProductReviewUtil, getProductSourcesUtil } from '../../utils/products';

export const createProduct = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product', serviceHandler: 'createProduct' });
    req.logger.info({ status: 'start' });

    try {
        const {title, price, description, available, brand, size, model, discount, status, colors} = req.body;
        const me = req.user

        if(!me.isAdmin || me.isBanner){
          const response = { status: 'No eres admin o estas bloqueado' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        if(!title || !price || !description || !available || !size){
          const response = { status: 'No data product provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        const ProductExist = await getProductExistUtil(title, price);

        if(ProductExist.length){
          return res.status(400).json({status: 'Estos datos ya pertenecen a otro producto, utilize otro titulo o precio'});
        }

        const imagen = await UploasProduct(req);

        const product: Product = {
          idProducts: uuidv4(),
          title,
          source: imagen,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          price,
          status: status || 'No Disponible',
          description,
          available,
          sold: 0,
          stars: 0,
          brand: brand || 'normal',
          size,
          model: model || 'normal',
          related_sources: [],
          discount: discount || 0,
          starsPeople: 0,
          colors: colors || null
        }

        await createProductUtil(product);

        return res.status(200).json();
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const MoreSourcesProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'MoreSourcesProduct' });
  req.logger.info({ status: 'start' });

  try {
      const {idProduct} = req.body;
      const me = req.user

      if(!me.isAdmin || me.isBanner){
        const response = { status: 'No eres admin o estas bloqueado' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      if(!idProduct){
          const response = { status: 'No product id provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
      }

      const urls = await UploadMoreSourcesProduct(req);

       if(urls.length){
          urls.forEach(async (item: string) => {
            const sourcesProduct: SourcesProduct = {
              idSourceProduct: uuidv4(),
              source: item,
              kind: 'IMAGEN',
              idProduct
            }

            await createProductSourcesUtil(sourcesProduct);
          })

          return res.status(200).json();
        }

        return res.status(400).json({ status: 'upload images faild' });
  } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
  }
}

export const getProducts = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProducts' });
    req.logger.info({ status: 'start' });

    try {
      let start: number;
      let products: Product[] = [];
      const { priceMin, priceMax, isPromo, order, orderPrice, orderStar } = req.query
      const findProduct = req.query.findProduct as string;

      const valueQuery = (query: any): boolean => {
        if(query === 'false' || query === 'undefined' || query === '0' || query === undefined){
          return false
        }
        return true
      }

      if(valueQuery(priceMin) || valueQuery(priceMax) || valueQuery(isPromo) || valueQuery(order) || valueQuery(orderPrice) || valueQuery(orderStar)){
        let sql: string = `SELECT * FROM products WHERE status = 'Disponible' AND price > ${valueQuery(priceMin) ? Number(priceMin) : 0} ${valueQuery(priceMax) ? `AND price < ${Number(priceMax)}` : ''} ${valueQuery(orderPrice) || valueQuery(orderStar) ? `ORDER BY ${valueQuery(orderPrice) ? 'price' : 'stars'} ${valueQuery(order) ? order : 'ASC'}` : ''}`;

        products = await new Promise((resolve, reject) => {
          dataBase.query(
            `${sql} LIMIT ${0}, 30;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
      }else{
        start = 0;
        products = await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM products WHERE status = 'Disponible' AND title LIKE '%${findProduct || ''}%' ORDER BY created_at DESC LIMIT ${start}, 30;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
      }

      products.map(item => item.created_at = format(new Date(item.created_at), 'yyyy-MM-dd'))

      return res.status(200).json({ products });
    } catch (error) {
        console.log(error.message);
        req.logger.error({ status: 'error', code: 500 });
        return res.status(404).json();
    }
}

export const getProduct = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProduct' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct} = req.params;

        if(!idProduct){
            const response = { status: 'No product id provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const Product: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM products WHERE status = 'Disponible' AND idProducts = '${idProduct}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        Product[0].related_sources = await getProductSourcesUtil(Product[0].idProducts);
        Product[0].related_sources.push({
          idSourceProduct: 'generado',
          source: Product[0].source,
          kind: 'IMAGEN',
          idProduct: Product[0].idProducts
        })

        Product.map(product => product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd'))

        return res.status(200).json({ product: Product[0] });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(404).json();
    }
}

export const getProductsOffers = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsOffers' });
    req.logger.info({ status: 'start' });

    try {
        const {limit} = req.params;
        let sql: string;
        const QueryLimit = Number(limit)

        if(QueryLimit){
          sql = `SELECT * FROM products WHERE status = 'Disponible' AND discount <> 0 LIMIT ${QueryLimit};`
        }else{
          sql = `SELECT * FROM products WHERE status = 'Disponible' AND discount <> 0;`
        }

        const Products: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              sql,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json({ products: Products });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(404).json();
    }
}

export const getProductsBestRated = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsBestRated' });
  req.logger.info({ status: 'start' });

    try {
        const {limit} = req.params;
        let sql: string;

        if(limit){
          sql = `SELECT * FROM products WHERE status = 'Disponible' AND stars > 4 LIMIT ${Number(limit)};`
        }else{
          sql = `SELECT * FROM products WHERE status = 'Disponible' AND stars > 4;`
        }

        const Products: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              sql,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json({ products: Products });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(404).json();
    }
}

export const getProductsCategory = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsCategory' });
  req.logger.info({ status: 'start' });

    try {
        const { idCategory } = req.params;

        const Products: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT products.* FROM product_category INNER JOIN products ON products.idProducts = product_category.idProduct INNER JOIN category ON category.idCategory = product_category.idCategory  WHERE category.titleCategory = '${idCategory}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json({ products: Products });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const createReviewProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'createReviewProduct' });
  req.logger.info({ status: 'start' });

  try {
      const {idOrden, idProduct, commentary, stars, received, recommendation} = req.body;
      const user = req.user

      if(!idOrden || !idProduct || !commentary || !stars || !recommendation || !received){
        const response = { status: 'No data product review provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const productReview: ProductReviews = {
        idProductReviews: uuidv4(),
        idProduct,
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        stars: stars || null,
        idUser: user.idUser,
        commentary,
        received,
        recommendation
      }

      await createProductReviewUtil(productReview);
      await UpdateQualifledOrdenUtil(idOrden , true);

      return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getReviewProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getReviewProduct' });
  req.logger.info({ status: 'start' });

  try {
      const {idProduct} = req.params;

      if(!idProduct){
          const response = { status: 'No product id provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
      }

      const reviews = await getProductReviewUtil(idProduct)

      reviews.map(review => review.created_at = format(new Date(review.created_at), 'PPPP', {locale: Locale}))

      return res.status(200).json({ reviews });
  } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'deleteProduct' });
  req.logger.info({ status: 'start' });

  try {
      const {idProduct} = req.params;
      const me = req.user

      if(!me.isAdmin || me.isBanner){
        const response = { status: 'No eres admin o estas bloqueado' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      if(!idProduct){
          const response = { status: 'No product id provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
      }

      await deleteProductUtil(idProduct)
      return res.status(200).json();
  } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
  }
}