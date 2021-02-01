import { Coupons } from "../../models/coupons";
import { dataBase } from "../database";

export const getCouponstUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM coupons;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Coupons[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}