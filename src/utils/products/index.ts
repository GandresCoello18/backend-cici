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

export const getProductByCategory = async (TitleCategory: string, limit: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT products.* FROM product_category INNER JOIN products ON products.idProducts = product_category.idProduct INNER JOIN category ON category.idCategory = product_category.idCategory WHERE category.titleCategory = '${TitleCategory}' ${
          limit ? `LIMIT ${limit}` : ''
        };`,
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
        `INSERT INTO product_sources (idSourceProduct, source, kind, idProduct, isDescription) VALUES ('${sourceProduct.idSourceProduct}', '${sourceProduct.source}', '${sourceProduct.kind}', '${sourceProduct.idProduct}', ${sourceProduct.isDescription});`,
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

export const getProductReviewUtil = async (
  idProduct: string,
  start: number,
  WhereApproved?: boolean,
) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT users.userName, users.avatar, productReviews.idProductReviews, productReviews.commentary, productReviews.stars, productReviews.created_at, productReviews.approved, productReviews.source FROM productReviews INNER JOIN users ON users.idUser = productReviews.idUser WHERE productReviews.idProduct = '${idProduct}' ${
          WhereApproved ? 'AND productReviews.approved = 1' : ''
        } ORDER BY productReviews.created_at DESC LIMIT ${start}, 15;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as ProductReviewByUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getCountProductsUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT COUNT(*) / 15 as totalProducts FROM products;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as { totalProducts: number }[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getCountResenaProductUtil = async (dataByPage: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT COUNT(*) / ${dataByPage} as total FROM productReviews;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as { total: number }[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductsAdminUtil = async (page?: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM products ORDER BY created_at DESC LIMIT ${page}, 15;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const createProductReviewUtil = async (productReview: ProductReviews) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO productReviews (idProductReviews, commentary, stars, created_at, idUser, idProduct, received, recommendation, approved, source) VALUES ('${
          productReview.idProductReviews
        }', '${productReview.commentary}', ${
          productReview.stars ? `${productReview.stars}` : null
        }, '${productReview.created_at}', '${productReview.idUser}', '${
          productReview.idProduct
        }', '${productReview.received}', '${productReview.recommendation}', ${
          productReview.approved
        }, ${productReview.source ? `'${productReview.source}'` : null});`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateApprovedReviewUtil = async (idProductReviews: string, approved: number) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE productReviews SET approved = ${approved} WHERE idProductReviews = '${idProductReviews}';`,
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
      dataBase.query(
        `DELETE FROM product_sources WHERE idProduct = '${idProduct}' AND source = '${public_id}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
