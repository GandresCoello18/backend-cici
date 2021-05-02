import { Category, CategoryProduct } from "../../models/category";
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

export const createCategoryProductUtil = async (idCategory: string, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO product_category (idCategory, idProduct) VALUES ('${idCategory}', '${idProduct}');`,
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

export const getExitsProductCategoryUtil = async (idCategory: string, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM product_category WHERE idCategory = '${idCategory}' AND idProduct = '${idProduct}';`,
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

export const getCategoryProductsUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT category.titleCategory, COUNT(*) as productos FROM product_category INNER JOIN category ON category.idCategory = product_category.idCategory INNER JOIN products ON products.idProducts = product_category.idProduct GROUP BY category.titleCategory;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as CategoryProduct[];
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