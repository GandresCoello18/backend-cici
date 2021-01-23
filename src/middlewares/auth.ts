import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { User } from '../models/users';
import { config } from '../utils';
import { getUserUtil } from '../utils/users';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

interface TokenInterface {
    idUser: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('auth start');

  try {
    const token: string | undefined = req.header('access-token');

    if (!token) {
      throw new Error();
    }

    jwt.verify(token, config.JWT_SECRET, async (err: any, decoded: TokenInterface) => {
        if(err){
            res.status(401).send({ error: 'Please authenticate.' });
        }else{
            const user = await getUserUtil({idUser: decoded.idUser});

            if(!user){
                throw new Error()
            }

            req.user = user[0];
            next();
        }
    });

  } catch (error) {
    console.log('auth error', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ error: 'Please authenticate as administrator.' });
  }
};
