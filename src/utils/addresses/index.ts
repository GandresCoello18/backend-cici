import { Addresses } from "../../models/addresses";
import { dataBase } from "../database";

export const createAddressUtil = async (Addresses: Addresses) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO addresses (idAddresses, title, phone, city, postalCode, address, idUser, created_at, selected) VALUES ('${Addresses.idAddresses}', '${Addresses.title}', ${Addresses.phone}, '${Addresses.city}', ${Addresses.postalCode}, '${Addresses.address}', '${Addresses.idUser}', '${Addresses.created_at}', ${Addresses.selected});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const ExistAddressUtil = async (title: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM addresses WHERE title = '${title}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Addresses[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getMyAddressUtil = async (idUser: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM addresses WHERE idUser = '${idUser}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Addresses[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}
