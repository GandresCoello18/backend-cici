import {
  Product,
  ProductReviewByUser,
  ProductReviews,
  SourcesProduct,
} from '../../models/products';
import { dataBase } from '../database';

export const createProductUtil = async (product: Product) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO products (idProducts, title, source, price, status, description, available, sold, stars, brand, size, model, created_at, discount, starsPeople, colors, updated_at, offer_expires_date) VALUES ('${
          product.idProducts
        }', '${product.title}', '${product.source}', ${product.price}, '${product.status}', '${
          product.description
        }', ${product.available}, ${product.sold}, ${product.stars}, '${product.brand}', '${
          product.size
        }', '${product.model}', '${product.created_at}', ${product.discount}, ${
          product.starsPeople
        }, ${product.colors ? `'${product.colors}'` : null}, '${product.updated_at}', ${
          product.offer_expires_date ? `'${product.offer_expires_date}'` : null
        });`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getProductUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM products WHERE status = 'Disponible' AND idProducts = '${idProduct}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductsUtil = async (findProduct: string, lastIdProduct?: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT *, DATEDIFF(NOW(), created_at) <= 7 as isNew FROM products WHERE status = 'Disponible' AND idProducts > '${
          lastIdProduct || ''
        }' AND title LIKE '%${findProduct || ''}%' ${
          !lastIdProduct ? 'ORDER BY updated_at DESC' : ''
        } LIMIT 8;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductExistUtil = async (title: string, price: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM products WHERE title = '${title}' AND price = ${price};`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductSearchUtil = async (key: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM products WHERE title LIKE '%${key}%' OR description LIKE '%${key}%' OR brand LIKE '%${key}%';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductByCategory = async (TitleCategory: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT products.* FROM product_category INNER JOIN products ON products.idProducts = product_category.idProduct INNER JOIN category ON category.idCategory = product_category.idCategory  WHERE category.titleCategory = '${TitleCategory}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getBestSellerProductByCategory = async (idCategory: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT products.* FROM product_category INNER JOIN category ON category.idCategory = product_category.idCategory INNER JOIN products ON products.idProducts = product_category.idProduct WHERE product_category.idCategory = ${idCategory} AND products.sold >= 40;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const createProductSourcesUtil = async (sourceProduct: SourcesProduct) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO product_sources (idSourceProduct, source, kind, idProduct) VALUES ('${sourceProduct.idSourceProduct}', '${sourceProduct.source}', '${sourceProduct.kind}', '${sourceProduct.idProduct}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getProductSourcesUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM product_sources WHERE idProduct = '${idProduct}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as SourcesProduct[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductReviewUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT users.userName, users.avatar, productReviews.idProductReviews, productReviews.commentary, productReviews.stars, productReviews.created_at FROM productReviews INNER JOIN users ON users.idUser = productReviews.idUser WHERE productReviews.idProduct = '${idProduct}' ORDER BY productReviews.created_at DESC LIMIT 5;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as ProductReviewByUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const createProductReviewUtil = async (productReview: ProductReviews) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO productReviews (idProductReviews, commentary, stars, created_at, idUser, idProduct, received, recommendation) VALUES ('${
          productReview.idProductReviews
        }', '${productReview.commentary}', ${
          productReview.stars ? `${productReview.stars}` : null
        }, '${productReview.created_at}', '${productReview.idUser}', '${
          productReview.idProduct
        }', '${productReview.received}', '${productReview.recommendation}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateProductStartPeopleUtil = async (idProducts: string, stars: number) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE products SET starsPeople = starsPeople + 1, stars = TRUNCATE((stars + ${stars}) / 5, 2) WHERE idProducts = '${idProducts}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateOfferExpiresProductUtil = async () => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE products SET discount = 0 WHERE NOW() > offer_expires_date;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateAddSoldProductUtil = async (quantity: number, idProducts: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE products SET sold = sold + ${quantity} WHERE idProducts = '${idProducts}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateSubtractAvailabledProductUtil = async (quantity: number, idProducts: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE products SET available = available - ${quantity} WHERE idProducts = '${idProducts}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteProductUtil = async (idProducts: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(`DELETE FROM products WHERE idProducts = '${idProducts}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteSourceProductUtil = async (idProduct: string, public_id: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(`DELETE FROM product_sources WHERE idProduct = '${idProduct}' AND source = '${public_id}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};