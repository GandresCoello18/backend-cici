import { TimeMessage } from "../../models/time-message";
import { dataBase } from "../database";

export const newTimeMessageUtil = async (message: TimeMessage) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO time_message (id_time_message, destination, subject, created_at, life_minutes) VALUES ('${message.id_time_message}', '${message.destination}', '${message.subject}', '${message.created_at}', ${message.life_minutes});`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const getTimeMessageUtil = async (id_time_message: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM time_message WHERE id_time_message = '${id_time_message}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as TimeMessage[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
  }