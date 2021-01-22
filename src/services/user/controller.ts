import { Request, Response } from 'express';
import { Users } from '../../models/users';
import {dataBase} from '../../utils';
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const getUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUser' });
    req.logger.info({ status: 'start' });
  
    try {
      const users: Users = await new Promise((resolve, reject) => {
        dataBase.query(
          `SELECT * FROM users;`,
          (err, data) => err ? reject(err) : resolve(data)
        );
      });

      return res.status(200).json({ users });
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const crerateUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'users', serviceHandler: 'crerateUser' });
    req.logger.info({ status: 'start', servicePayload: req.body });
  
    try {
      const {userName, email, password, isAdmin, avatar} = req.body;

      if(!userName || !email  || !password || !avatar){
        const response = { status: 'No data user provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const passwordEncrip = await bcryptjs.hash(password, 10);

      const user: Users = {
        idUser: uuidv4(),
        userName,
        email,
        password: passwordEncrip,
        created_at: new Date(),
        isAdmin: isAdmin ? true : false,
        avatar
      }

      await new Promise((resolve, reject) => {
        dataBase.query(
          `INSERT INTO users (idUser, userName, email, password, created_at, isAdmin, avatar) VALUES ('${user.idUser}', '${user.userName}', '${user.email}', '${user.password}', ${user.created_at}, ${user.isAdmin}, '${user.avatar}');`,
          (err, data) => err ? reject(err) : resolve(data)
        );
      });

      return res.status(200).json();
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
}