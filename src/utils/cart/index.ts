import { Cart, CartProduct } from "../../models/cart";
import { Product } from "../../models/products";
import { dataBase } from "../database";

export const createCartUtil = async (cart: Cart) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO cart (idCart, created_at, status, idUser) VALUES ('${cart.idCart}', '${cart.created_at}', '${cart.status}', '${cart.idUser}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createCartProductUtil = async (cartProduct: CartProduct) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO cart_product (id_cart_product, idProduct, quantity, idCart) VALUES ('${cartProduct.id_cart_product}', '${cartProduct.idProduct}', ${cartProduct.quantity}, '${cartProduct.idCart}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const ExistCartUserUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM cart WHERE idUser = '${idUser}' AND status = 'Pendiente';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Cart[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getProductCartUserUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT products.*, cart_product.quantity as quantity FROM cart INNER JOIN cart_product ON cart_product.idCart = cart.idCart INNER JOIN products ON products.idProducts = cart_product.idProduct WHERE cart.idUser = '${idUser}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Product[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const ExistProductCart = async (idCart: string, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM cart_product WHERE idProduct = '${idProduct}' AND idCart = '${idCart}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as CartProduct[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const UpdateProductCart = async (idCart: string, idProduct: string, quantity: number) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `UPDATE cart_product SET quantity = ${quantity} WHERE idProduct = '${idProduct}' AND idCart = '${idCart}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const DeleteProductCart = async (idCart: string, idProduct: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `DELETE FROM cart_product WHERE idProduct = '${idProduct}' AND idCart = '${idCart}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return [];
    }
}
