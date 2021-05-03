import { Category, CategoryProduct, ResProductCategory } from "../../models/category";
import { dataBase } from "../database";

export const createCategoryUtil = async (title: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO category (titleCategory) VALUES ('${title}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createCategoryProductUtil = async (idCategory: number, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO product_category (idCategory, idProduct) VALUES (${idCategory}, '${idProduct}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const getExitsCategoryUtil = async (title: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM category WHERE titleCategory = '${title}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Category[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getExitsProductCategoryUtil = async (idCategory: number, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM product_category WHERE idCategory = ${idCategory} AND idProduct = '${idProduct}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as CategoryProduct[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getCategorysUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM category ORDER BY idCategory DESC;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Category[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getCategoryCountProductsUtil = async (idCategory: number) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT COUNT(*) as productos FROM product_category WHERE idCategory = ${idCategory};`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as {productos: number}[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getCategoryByProductUtil = async (idProduct: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT product_category.id_product_category, category.titleCategory FROM product_category INNER JOIN category ON category.idCategory = product_category.idCategory WHERE product_category.idProduct = '${idProduct}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as ResProductCategory[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const deleteCategoryUtil = async (title: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `DELETE FROM category WHERE titleCategory = '${title}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const deleteCategoryProductUtil = async (id_product_category: number) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `DELETE FROM product_category WHERE id_product_category = ${id_product_category};`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}