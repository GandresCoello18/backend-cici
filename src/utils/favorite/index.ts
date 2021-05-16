import { Favorite } from "../../models/favorite";
import { Product } from "../../models/products";
import { dataBase } from "../database";

export const getProductFavoriteUtil = async (idProduct: string, idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT * FROM favorite_product WHERE idProduct = '${idProduct}' AND idUser = '${idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        }) as Favorite[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getProductsFavoriteUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT products.* FROM favorite_product INNER JOIN products ON products.idProducts = favorite_product.idProduct WHERE favorite_product.idUser = '${idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        }) as Product[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getMyProductsFavoriteUtil = async (idUser: string, page: number) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT products.* FROM favorite_product INNER JOIN products ON products.idProducts = favorite_product.idProduct WHERE favorite_product.idUser = '${idUser}' LIMIT ${page}, 15;`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        }) as Product[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getProductsFavoriteCountUtil = async (idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT COUNT(*) as COUNT FROM favorite_product WHERE idProduct = '${idProduct}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        }) as { COUNT: number }[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getProductsFavoriteCountByUserUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT COUNT(*) / 15 as totalFavorites FROM favorite_product WHERE idUser = '${idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        }) as { totalFavorites: number }[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const insertFavoriteUtil = async (favorite: Favorite) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO favorite_product (id_favorite_product, idProduct, idUser, created_at) VALUES ('${favorite.id_favorite_product}', '${favorite.idProduct}', '${favorite.idUser}', '${favorite.created_at}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const deletetFavoriteUtil = async (idProduct: string, idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `DELETE FROM favorite_product WHERE idProduct = '${idProduct}' AND idUser = '${idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const deleteAllFavoriteUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
                `DELETE FROM favorite_product WHERE idUser = '${idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}