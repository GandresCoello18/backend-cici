import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product, SourcesProduct } from '../../models/products';
import { dataBase } from '../../utils';
import { createProductSourcesUtil, createProductUtil, getProductSourcesUtil } from '../../utils/products';

export const createProduct = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product', serviceHandler: 'createProduct' });
    req.logger.info({ status: 'start' });
  
    try {
        const {title, source, price, description, available, brand, size, model, related_sources} = req.body;

        if(!title || !source || !price || !description || !available || !brand || !size || !model){
          const response = { status: 'No data product provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        const ProductExist: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM products WHERE title = '${title}' AND price = ${price};`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });

        if(ProductExist.length){
          return res.status(400).json({status: 'Estos datos ya pertenecen a otro producto, utilize otro titulo o precio'});
        }else{

          const product: Product = {
            idProducts: uuidv4(),
            title,
            source,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            price,
            status,
            description,
            available,
            sold: 0,
            stars: 0,
            brand,
            size,
            model,
            related_sources: [],
            discount: 0,
            starsPeople: 0,
          }

          await createProductUtil(product);

          if(related_sources.length){
            related_sources.foreach(async (item: SourcesProduct) => {
              const sourcesProduct: SourcesProduct = {
                idSourceProduct: uuidv4(),
                source: item.source,
                kind: item.kind,
                idProduct: product.idProducts
              }

              await createProductSourcesUtil(sourcesProduct);
            })
          }

          return res.status(200).json();
        }
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const getProducts = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProducts' });
    req.logger.info({ status: 'start' });

    try {
        const Products: Product[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM products WHERE status = 'Disponible' ORDER BY idProducts LIMIT 12;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json({ products: Products });
    } catch (error) {
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

        if(limit){
          sql = `SELECT * FROM products WHERE status = 'Disponible' AND discount <> 0 LIMIT ${Number(limit)};`
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