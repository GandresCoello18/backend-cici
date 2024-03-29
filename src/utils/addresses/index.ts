import { Addresses } from '../../models/addresses';
import { dataBase } from '../database';

export const createAddressUtil = async (Addresses: Addresses) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO addresses (idAddresses, title, phone, city, postalCode, address, idUser, created_at, selected, province) VALUES ('${Addresses.idAddresses}', '${Addresses.title}', ${Addresses.phone}, '${Addresses.city}', ${Addresses.postalCode}, '${Addresses.address}', '${Addresses.idUser}', '${Addresses.created_at}', ${Addresses.selected}, '${Addresses.province}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const ExistAddressUtil = async (title: string, idUser: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM addresses WHERE title = '${title}' AND idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Addresses[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getMyAddressUtil = async (idUser: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT addresses.*, provinces.nombre as province FROM addresses INNER JOIN provinces ON provinces.codeProvince = addresses.province WHERE addresses.idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Addresses[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getSelectMyAddressUtil = async (idUser: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM addresses WHERE idUser = '${idUser}' WHERE selected = ${1};`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Addresses[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const deleteMyAddressUtil = async (idUser: string, title: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `DELETE FROM addresses WHERE idUser = '${idUser}' AND title = '${title}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getSelectAddressUtil = async (idUser: string, title: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT selected FROM addresses WHERE idUser = '${idUser}' AND title = '${title}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Addresses[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const updateSelectAddressUtil = async (
  idUser: string,
  title: string,
  isSelected: boolean,
) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE addresses SET selected = ${isSelected} WHERE idUser = '${idUser}' AND title = '${title}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Addresses[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
