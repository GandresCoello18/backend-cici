import { Product } from "../../models/products";
import { dataBase } from "../database";


export const createProductUtil = async (product: Product) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO products (idProducts, title, source, price, status, description, available, sold, stars, brand, size, model, related_sources, created_at, discount) VALUES ('${product.idProducts}', '${product.title}', '${product.source}', ${product.price}, '${product.status}', '${product.description}', ${product.available}, ${product.sold}, ${product.stars}, '${product.brand}', '${product.size}', '${product.model}', '${product.related_sources}', '${product.created_at}', ${product.discount});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}
