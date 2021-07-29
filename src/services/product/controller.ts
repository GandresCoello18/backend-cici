/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import Locale from 'date-fns/locale/es';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { truncarDecimal } from '../../helpers/truncar';
import { Product, ProductReviews, SourcesProduct } from '../../models/products';
import { dataBase } from '../../utils';
import { getCategoryByProductUtil, getCategorysUtil } from '../../utils/category';
import {
  DeleteProduct,
  UploadMoreSourcesProduct,
  UploasProduct,
} from '../../utils/cloudinary/product';
import { UpdateQualifledOrdenUtil } from '../../utils/orden';
import {
  createProductReviewUtil,
  createProductSourcesUtil,
  createProductUtil,
  deleteProductUtil,
  deleteSourceProductUtil,
  getBestSellerProductByCategory,
  getCountProductsUtil,
  getProductByCategory,
  getProductExistUtil,
  getProductReviewUtil,
  getProductsAdminUtil,
  getProductSearchUtil,
  getProductSourcesUtil,
  getProductsUtil,
  getProductUtil,
  updateProductStartPeopleUtil,
} from '../../utils/products';

export const createProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'createProduct' });
  req.logger.info({ status: 'start' });

  try {
    const {
      title,
      price,
      description,
      available,
      brand,
      size,
      model,
      discount,
      status,
      colors,
      offer_expires_date,
    } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!title || !price || !description || !available || !size) {
      const response = { status: 'No data product provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const ProductExist = await getProductExistUtil(title, price);

    if (ProductExist.length) {
      return res.status(400).json({
        status: 'Estos datos ya pertenecen a otro producto, utilize otro titulo o precio',
      });
    }

    const imagen = await UploasProduct(req);

    const product: Product = {
      idProducts: uuidv4(),
      title,
      source: imagen,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
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
      colors: colors || null,
      offer_expires_date: offer_expires_date || null,
    };

    await createProductUtil(product);

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const MoreSourcesProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'MoreSourcesProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct, isDescription } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idProduct || !isDescription) {
      const response = { status: 'No product id or is Description provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const urls = await UploadMoreSourcesProduct(req);

    if (urls.length) {
      urls.forEach(async (item: string) => {
        const sourcesProduct: SourcesProduct = {
          idSourceProduct: uuidv4(),
          source: item,
          kind: 'IMAGEN',
          idProduct,
          isDescription: Number(isDescription),
        };

        await createProductSourcesUtil(sourcesProduct);
      });

      return res.status(200).json();
    }

    return res.status(400).json({ status: 'upload images faild' });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getProducts = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProducts' });
  req.logger.info({ status: 'start' });

  try {
    const lastIdProduct = req.query.lastIdProduct as string;
    const page = req.query.page as string;
    const findProduct = req.query.findProduct as string;
    let pages = 0;
    let start = 0;
    const client = req.get('origin');

    const { priceMin, priceMax, isPromo, order, orderPrice, orderStar } = req.query;

    let products: Product[] = [];

    if (Number(page)) {
      const totalProduct = await getCountProductsUtil();
      pages = totalProduct[0].totalProducts;

      if (Number(page) > 1) {
        start = Math.trunc((Number(page) - 1) * 15);
      }
    }

    if (client === 'https://dashboard.cici.beauty' || client === 'http://localhost:3000') {
      products = await getProductsAdminUtil(start);

      if (pages > 1.0) {
        pages = truncarDecimal(pages) + 1;
      }

      return res.status(200).json({ products, pages });
    }

    const valueQuery = (query: any): boolean => {
      if (query === 'false' || query === 'undefined' || query === '0' || query === undefined) {
        return false;
      }
      return true;
    };

    if (
      valueQuery(priceMin) ||
      valueQuery(priceMax) ||
      valueQuery(isPromo) ||
      valueQuery(order) ||
      valueQuery(orderPrice) ||
      valueQuery(orderStar)
    ) {
      const sql = `SELECT *, DATEDIFF(NOW(), created_at) <= 7 as isNew FROM products WHERE status = 'Disponible' AND price > ${
        valueQuery(priceMin) ? Number(priceMin) : 0
      } ${valueQuery(priceMax) ? `AND price < ${Number(priceMax)}` : ''} ${
        valueQuery(orderPrice) || valueQuery(orderStar)
          ? `ORDER BY ${valueQuery(orderPrice) ? 'price' : 'stars'} ${
              valueQuery(order) ? order : 'ASC'
            }`
          : ''
      }`;

      products = await new Promise((resolve, reject) => {
        dataBase.query(`${sql} LIMIT ${0}, 30;`, (err, data) =>
          err ? reject(err) : resolve(data),
        );
      });
    } else {
      products = await getProductsUtil(findProduct, lastIdProduct);
    }

    products.map(item => (item.created_at = format(new Date(item.created_at), 'yyyy-MM-dd')));

    return res.status(200).json({ products });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct } = req.params;

    if (!idProduct) {
      const response = { status: 'No product id provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const Product = await getProductUtil(idProduct);

    if (!Product.length) {
      return res.status(200).json({ product: undefined });
    }

    Product[0].categorys = await getCategoryByProductUtil(idProduct);

    Product[0].related_sources = await getProductSourcesUtil(Product[0].idProducts);
    Product[0].related_sources.push({
      idSourceProduct: 'generado',
      source: Product[0].source,
      kind: 'IMAGEN',
      idProduct: Product[0].idProducts,
      isDescription: 0,
    });

    Product.map(
      product => (product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd')),
    );
    Product.map(
      product => (product.updated_at = format(new Date(product.updated_at), 'yyyy-MM-dd HH:mm:ss')),
    );

    return res.status(200).json({ product: Product[0] });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getProductsOffers = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsOffers' });
  req.logger.info({ status: 'start' });

  try {
    const { limit } = req.params;
    const QueryLimit = Number(limit);

    const sql = `SELECT * FROM products WHERE status = 'Disponible' AND discount <> 0 ${
      QueryLimit ? `LIMIT ${QueryLimit}` : ''
    };`;

    const products: Product[] = await new Promise((resolve, reject) => {
      dataBase.query(sql, (err, data) => (err ? reject(err) : resolve(data)));
    });

    return res.status(200).json({ products });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getProductsBestRated = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsBestRated' });
  req.logger.info({ status: 'start' });

  try {
    const { limit } = req.params;
    let sql: string;

    if (limit) {
      sql = `SELECT * FROM products WHERE status = 'Disponible' AND stars >= 4 LIMIT ${Number(
        limit,
      )};`;
    } else {
      sql = `SELECT * FROM products WHERE status = 'Disponible' AND stars >= 4;`;
    }

    const Products: Product[] = await new Promise((resolve, reject) => {
      dataBase.query(sql, (err, data) => (err ? reject(err) : resolve(data)));
    });

    return res.status(200).json({ products: Products });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getSearchProducts = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getSearchProducts' });
  req.logger.info({ status: 'start' });

  try {
    const { key } = req.params;

    if (!key) {
      const response = { status: 'No product key provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const products = await getProductSearchUtil(key);

    return res.status(200).json({ products });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getProductsCategory = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getProductsCategory' });
  req.logger.info({ status: 'start' });

  try {
    const { TitleCategory } = req.params;
    const limit = req.query.limit as string;

    if (!TitleCategory) {
      const response = { status: 'No data Title Category provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const products = await getProductByCategory(TitleCategory, Number(limit));

    return res.status(200).json({ products: products.reverse() });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const createReviewProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'createReviewProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idOrden, idProduct, commentary, stars, received, recommendation } = req.body;
    const user = req.user;

    if (!idOrden || !idProduct || !commentary || !stars || !recommendation || !received) {
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
      recommendation,
    };

    await createProductReviewUtil(productReview);
    await UpdateQualifledOrdenUtil(idOrden, true);
    await updateProductStartPeopleUtil(idProduct, stars);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getBestSellersByCategory = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getBestSellersByCategory' });
  req.logger.info({ status: 'start' });

  try {
    const categorys = await getCategorysUtil();

    let BestSellers = await Promise.all(
      categorys.map(async cate => {
        const products = await getBestSellerProductByCategory(cate.idCategory);

        return {
          categoria: cate.titleCategory,
          products,
        };
      }),
    );

    BestSellers = BestSellers.filter(product => product.products.length > 0);

    return res.status(200).json({ BestSellers });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getReviewProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'getReviewProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct } = req.params;

    if (!idProduct) {
      const response = { status: 'No product id provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const reviews = await getProductReviewUtil(idProduct);

    reviews.map(
      review =>
        (review.created_at = format(new Date(review.created_at), 'PPPP', { locale: Locale })),
    );

    return res.status(200).json({ reviews });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'deleteProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct } = req.params;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idProduct) {
      const response = { status: 'No product id provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteProductUtil(idProduct);
    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const deleteImageProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'product', serviceHandler: 'deleteImageProduct' });
  req.logger.info({ status: 'start' });

  try {
    const { idProduct } = req.params;
    const { public_id } = req.query;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idProduct) {
      const response = { status: 'No product id provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteSourceProductUtil(idProduct, public_id as string);
    await DeleteProduct(req);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
