import { Product, ProductReviewByUser, ProductReviews, SourcesProduct } from "../../models/products";
import { dataBase } from "../database";

export const createProductUtil = async (product: Product) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO products (idProducts, title, source, price, status, description, available, sold, stars, brand, size, model, created_at, discount, starsPeople) VALUES ('${product.idProducts}', '${product.title}', '${product.source}', ${product.price}, '${product.status}', '${product.description}', ${product.available}, ${product.sold}, ${product.stars}, '${product.brand}', '${product.size}', '${product.model}', '${product.created_at}', ${product.discount}, ${product.starsPeople});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createProductSourcesUtil = async (sourceProduct: SourcesProduct) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO product_sources (idSourceProduct, source, kind, idProduct) VALUES ('${sourceProduct.idSourceProduct}', '${sourceProduct.source}', '${sourceProduct.kind}', '${sourceProduct.idProduct}');`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const getProductSourcesUtil = async (idProduct: string) => {
  try {
      const SP: SourcesProduct[] = await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM product_sources WHERE idProduct = '${idProduct}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });

      return SP;
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getProductReviewUtil = async (idProduct: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT users.userName, users.avatar, productReviews.idProductReviews, productReviews.commentary, productReviews.stars, productReviews.created_at FROM productReviews INNER JOIN users ON users.idUser = productReviews.idUser WHERE productReviews.idProduct = '${idProduct}' ORDER BY productReviews.created_at DESC LIMIT 5;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as ProductReviewByUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const createProductReviewUtil = async (productReview: ProductReviews) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO productReviews (idProductReviews, commentary, stars, created_at, idUser, idProduct) VALUES ('${productReview.idProductReviews}', '${productReview.commentary}', ${productReview.stars ? `${productReview.stars}` : null}, '${productReview.created_at}', '${productReview.idUser}', '${productReview.idProduct}');`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}
