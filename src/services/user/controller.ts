import { Request, Response } from 'express';
import { format } from 'date-fns'
import Locale from 'date-fns/locale/es'
import { User } from '../../models/users';
import jwt from "jsonwebtoken";
import {config, createUserUtil, dataBase, getUserUtil, updatePasswordUserUtil, updateUserUtil} from '../../utils';
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const getUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUser' });
    req.logger.info({ status: 'start' });

    try {
      const user = req.user
      user.password = ''
      user.created_at = format(new Date(user.created_at), 'PPPP', {locale: Locale})
      return res.status(200).json({ me: user });
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};

export const crerateUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'users', serviceHandler: 'crerateUser' });
    req.logger.info({ status: 'start' });

    try {
      const {userName, email, password, isAdmin, avatar, provider} = req.body;

      if(!userName || !email || !provider){
        const response = { status: 'No data user provided' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const userExist = await getUserUtil({email_and_username: {userName, email}});

      if(userExist.length){
        return res.status(400).json({status: 'Estos datos ya pertenecen a otra cuenta, utilize otro Nombre de usuario o Email'});
      }else{
        let passwordEncrip: string | null = null;

        if (provider === 'cici' && password) {
          passwordEncrip = await bcryptjs.hash(password, 10);
        }

        const user: User = {
          idUser: uuidv4(),
          userName,
          email,
          password: passwordEncrip ? passwordEncrip : null,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          isAdmin: isAdmin ? true : false,
          avatar: avatar ? avatar : null,
          provider: provider ? provider : 'cici',
        }

        await createUserUtil(user);

        return res.status(200).json();
      }
    } catch (error) {
      req.logger.error({ status: 'error', code: 500, error: error.message });
      return res.status(404).json();
    }
}

export const login = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'login' });
  req.logger.info({ status: 'start' });

  try {
    const {email, password, provider, userName, avatar} = req.body;

    if(!email || !provider){
      const response = { status: 'No data user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    let user: User[] | null = null;

    if(provider === 'cici'){
      const userExist = await getUserUtil({email});

      if(userExist.length){
        const passwordDB = userExist[0].password as string;
        const ValidatePassword = await bcryptjs.compare(password, passwordDB);
        
        ValidatePassword ? user = userExist : [];
      }else{
        return res.status(400).json({status: 'Datos incorrectos, revise e intentelo de nuevo'});
      }
    }else{
      const userExist = await getUserUtil({email});

      if(userExist.length){
        user = await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM users WHERE email = '${email}' AND provider = '${provider}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
      }else{
        const saveUser: User = {
          idUser: uuidv4(),
          userName,
          email,
          password: null,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          isAdmin: false,
          avatar,
          provider: provider ? provider : 'cici',
        }

        await createUserUtil(saveUser);
        user = [saveUser]
      }
    }

    let me;

    if(user?.length){
      user[0].password = ''

      me = {
        user: user[0],
        token: jwt.sign({idUser: user[0].idUser}, config.JWT_SECRET),
      }

      return res.status(200).json({me})
    }else{
      return res.status(400).json({status: 'Datos incorrectos, revise e intentelo de nuevo'});
    }
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(404).json();
  }
}

export const updateUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updateUser' });
  req.logger.info({ status: 'start' });

  try {
    const {userName, email} = req.body
    const user = req.user
  
    if(!email || !userName){
      const response = { status: 'No data user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await updateUserUtil(userName, email, user.idUser)

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
}

export const updatePasswordUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updatePasswordUser' });
  req.logger.info({ status: 'start' });

  try {
    const {newKey, currentKey} = req.body
    const user = req.user
  
    if(!currentKey || !newKey){
      const response = { status: 'No data password user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if(user.password && user.provider === 'cici'){
      const ValidatePassword = await bcryptjs.compare(currentKey, user.password);
      
      if(!ValidatePassword){
        const response = { status: 'La clave actual es incorrecta, revise y veulva a intentarl' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const newPassword: string = await bcryptjs.hash(newKey, 10);
      await updatePasswordUserUtil(newPassword, user.idUser)
      return res.status(200).json();

    }

    const response = { status: 'No user provided cici' };
    req.logger.warn(response);
    return res.status(400).json(response);

  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
}
