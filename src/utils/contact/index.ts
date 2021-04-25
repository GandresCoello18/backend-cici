import { Contact } from "../../models/contact";
import { dataBase } from "../database";

export const NewContactUtil = async (contact: Contact) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO contact (idContact, name, message, email, subject, created_at, status) VALUES ('${contact.idContact}', '${contact.name}', '${contact.message}', '${contact.email}', '${contact.subject}', '${contact.created_at}', '${contact.status}');`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const GetContactsUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM contact ORDER BY created_at DESC;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        }) as Contact[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const UpdateStatusContactUtil = async (idContact: string, status: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `UPDATE contact SET status = '${status}' WHERE idContact = '${idContact}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const DeleteContactUtil = async (idContact: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `DELETE FROM contact idContact = '${idContact}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}