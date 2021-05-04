import { Cart, CartProduct, ProductCart } from "../../models/cart";
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
              `INSERT INTO cart_product (id_cart_product, idProduct, quantity, idCart, colour) VALUES ('${cartProduct.id_cart_product}', '${cartProduct.idProduct}', ${cartProduct.quantity}, '${cartProduct.idCart}', ${cartProduct.colour ? `'${cartProduct.colour}'` : null});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const getProductCartUserUtil = async (idUser: string, status: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT products.*, cart_product.quantity as quantity FROM cart INNER JOIN cart_product ON cart_product.idCart = cart.idCart INNER JOIN products ON products.idProducts = cart_product.idProduct WHERE cart.idUser = '${idUser}' AND cart.status = '${status}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Product[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getStatusCartUserUtil = async (idUser: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM cart WHERE idUser = '${idUser}' AND status = '${status}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Cart[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCartProductUtil = async (idCart: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM cart_product  WHERE idCart = '${idCart}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as CartProduct[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getProductCartUtil = async (idCart: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT products.idProducts, products.source, products.title, products.price, cart_product.quantity, cart_product.colour FROM cart_product INNER JOIN products ON products.idProducts = cart_product.idProduct WHERE cart_product.idCart = '${idCart}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as ProductCart[];
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

export const CartAbandonado = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT users.userName, users.email, cart.idCart FROM cart INNER JOIN users ON users.idUser = cart.idUser WHERE DATEDIFF(NOW(), cart.created_at) = 30 AND cart.status = 'Pending' GROUP BY users.email, users.userName, cart.idCart;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as {userName: string, email: string, idCart: string}[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const UpdateProductCart = async (idCart: string, idProduct: string, quantity: number, colour: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `UPDATE cart_product SET quantity = ${quantity}, colour = ${colour ? `'${colour}'` : null} WHERE idProduct = '${idProduct}' AND idCart = '${idCart}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const UpdateStatusCart = async (idCart: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE cart SET status = '${status}' WHERE idCart = '${idCart}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
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
        return false;
    }
}
