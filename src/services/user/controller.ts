import { Request, Response } from 'express';
import { addMonths, format } from 'date-fns';
import Locale from 'date-fns/locale/es';
import { User } from '../../models/users';
import jwt from 'jsonwebtoken';
import {
  config,
  createUserUtil,
  deleteUserUtil,
  getUserProviderUtil,
  getUsersUtil,
  getUserUtil,
  updateAvatarUserUtil,
  updatePasswordUserUtil,
  updateUserUtil,
  updateValidEmailUserUtil,
} from '../../utils';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUserCouponsUtil, getCouponsUserFreetUtil } from '../../utils/coupons';
import { CouponsUser } from '../../models/coupons';
import { UploadAvatarUser } from '../../utils/cloudinary/user';
import { SendEmail } from '../../utils/email/send';
import { WelcomeEmail } from '../../utils/email/template/welcome';
import { getStatisticsUserUtil } from '../../utils/statistics';
import { TimeMessage } from '../../models/time-message';
import { newTimeMessageUtil } from '../../utils/time-message';

export const getMe = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'getMe' });
  req.logger.info({ status: 'start' });

  try {
    const user = req.user;
    user.password = '';
    user.created_at = format(new Date(user.created_at), 'PPPP', { locale: Locale });
    return res.status(200).json({ me: user });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const getUsers = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUsers' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const findUser = req.query.findUser as string;
    const page = req.query.page as string;
    let pages = 0;
    let start = 0;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (Number(page)) {
      const totalUser = await getStatisticsUserUtil();
      pages = Math.trunc(totalUser[0].total / 15);

      if (Number(page) > 1) {
        start = Math.trunc((Number(page) - 1) * 15);
      }
    }

    const users = await getUsersUtil(findUser || undefined, start);

    users.map(user => (user.created_at = format(new Date(user.created_at), 'yyyy-MM-dd')));

    return res.status(200).json({ users, pages });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const getUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUser' });
  req.logger.info({ status: 'start' });

  try {
    const { idUser } = req.params;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const user = await getUserUtil({ idUser });
    user[0].created_at = format(new Date(user[0].created_at), 'PPPP', { locale: Locale });

    return res.status(200).json({ user: user[0] });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const getUserName = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUserName' });
  req.logger.info({ status: 'start' });

  try {
    const { username } = req.params;
    const user = await getUserUtil({ userName: username });

    if (user.length) {
      user[0].password = '';
      user[0].email = '';
      return res.status(200).json({ user: user[0] });
    }

    return res.status(200).json({ user: undefined });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const crerateUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'crerateUser' });
  req.logger.info({ status: 'start' });

  try {
    const { userName, email, password, isAdmin, avatar, provider, phone } = req.body;

    if (!userName || !email || !provider) {
      const response = { status: 'No data user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const userExist = await getUserUtil({ email_and_username: { userName, email } });

    if (userExist.length) {
      return res.status(400).json({
        status: 'Estos datos ya pertenecen a otra cuenta, utilize otro Nombre de usuario o Email',
      });
    }

    let passwordEncrip: string | null = null;

    if (provider === 'cici' && password) {
      passwordEncrip = await bcryptjs.hash(password, 10);
    }

    const user: User = {
      idUser: uuidv4(),
      userName,
      email,
      password: passwordEncrip || null,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      isAdmin: isAdmin ? true : false,
      avatar: avatar || null,
      provider: provider || 'cici',
      phone: phone || null,
      isBanner: false,
      ciciRank: 0,
      validatedEmail: false,
    };

    await createUserUtil(user);

    const message: TimeMessage = {
      id_time_message: uuidv4(),
      destination: email,
      subject: 'Confirmar cuenta',
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      life_minutes: 0,
    };

    await newTimeMessageUtil(message);

    await SendEmail({
      to: email,
      subject: 'Tenemos un regalo para ti | Cici beauty place',
      text: '',
      html: WelcomeEmail,
    });

    const userCoupon: CouponsUser = {
      id_user_coupons: uuidv4(),
      idUser: user.idUser,
      idCoupon: null,
      expiration_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      idGuestUser: null,
      status: 'Pendiente',
    };
    await createUserCouponsUtil(userCoupon);

    return res.status(201).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const login = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'login' });
  req.logger.info({ status: 'start' });

  try {
    const { email, password, provider, userName, avatar } = req.body;

    if (!email || !provider) {
      const response = { status: 'No data user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    let user: User[];

    if (provider === 'cici') {
      const userExist = await getUserUtil({ email });

      if (!userExist.length) {
        return res.status(400).json({ status: 'Datos incorrectos, revise e intentelo de nuevo' });
      }

      if (req.hostname === 'dashboard.cici.beauty' && !userExist[0].isAdmin) {
        return res
          .status(400)
          .json({ status: 'Panel de control solo disponible para admistradores' });
      }

      const passwordDB = userExist[0].password as string;
      const ValidatePassword = await bcryptjs.compare(password, passwordDB);

      ValidatePassword ? (user = userExist) : (user = []);
    } else {
      const userExist = await getUserUtil({ email });

      if (userExist.length) {
        user = await getUserProviderUtil(email, provider);

        if (!user.length) {
          return res.status(400).json({
            status: `Este usuario no usa (${provider.toUpperCase()}) como proveedor de datos.`,
          });
        }
      } else {
        const saveUser: User = {
          idUser: uuidv4(),
          userName,
          email,
          password: null,
          created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          isAdmin: false,
          avatar,
          provider: provider || 'cici',
          phone: null,
          isBanner: false,
          ciciRank: 0,
          validatedEmail: true,
        };

        await createUserUtil(saveUser);
        user = [saveUser];
      }
    }

    const couponFree = await getCouponsUserFreetUtil(user[0].idUser);

    if (couponFree.length === 0) {
      const userCoupon: CouponsUser = {
        id_user_coupons: uuidv4(),
        idUser: user[0].idUser,
        idCoupon: null,
        expiration_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        idGuestUser: null,
        status: 'No valido aun',
      };

      await createUserCouponsUtil(userCoupon);
      await SendEmail({
        to: email,
        subject: 'Tenemos un regalo para ti | Cici beauty place',
        text: '',
        html: WelcomeEmail,
      });
    }

    if (user?.length) {
      if (user[0].isBanner) {
        return res.status(400).json({ status: 'Usuario bloqueado.' });
      }

      user[0].password = '';

      const me = {
        user: user[0],
        token: jwt.sign({ idUser: user[0].idUser }, config.JWT_SECRET, { expiresIn: '3h' }),
      };

      return res.status(200).json({ me });
    }

    return res.status(400).json({ status: 'Datos incorrectos, revise e intentelo de nuevo' });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const updateMeUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updateMeUser' });
  req.logger.info({ status: 'start' });

  try {
    const { userName, email, phone } = req.body;
    const user = req.user;

    if (!email || !userName || !phone) {
      const response = { status: 'No data user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await updateUserUtil(userName, email, phone, user.idUser);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const updatePasswordEmail = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updatePasswordEmail' });
  req.logger.info({ status: 'start' });

  try {
    const { newKey } = req.body;
    const { email } = req.params;

    if (!email || !newKey) {
      const response = { status: 'No data password user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const user = await getUserUtil({ email });

    if (user[0].password && user[0].provider === 'cici') {
      const newPassword: string = await bcryptjs.hash(newKey, 10);
      await updatePasswordUserUtil(newPassword, user[0].idUser);

      return res.status(200).json();
    }

    const response = { status: 'No user provided cici' };
    req.logger.warn(response);
    return res.status(400).json(response);
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const updatePasswordUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updatePasswordUser' });
  req.logger.info({ status: 'start' });

  try {
    const { newKey, currentKey } = req.body;
    const user = req.user;

    if (!currentKey || !newKey) {
      const response = { status: 'No data password user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (user.password && user.provider === 'cici') {
      const ValidatePassword = await bcryptjs.compare(currentKey, user.password);

      if (!ValidatePassword) {
        const response = { status: 'Datos incorrectos, revise y vuelva a intentarlo' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      const newPassword: string = await bcryptjs.hash(newKey, 10);
      await updatePasswordUserUtil(newPassword, user.idUser);
      return res.status(200).json();
    }

    const response = { status: 'No user provided cici' };
    req.logger.warn(response);
    return res.status(400).json(response);
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const updateValidateEmailUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updateValidateEmailUser' });
  req.logger.info({ status: 'start' });

  try {
    const { validate } = req.body;
    const user = req.user;

    if (validate !== undefined || validate !== null) {
      const response = { status: 'No data validate email user provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await updateValidEmailUserUtil(validate, user.email);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const updateAvatardUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'updateAvatardUser' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    const src = await UploadAvatarUser(req);
    await updateAvatarUserUtil(src, me.idUser);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'deleteUser' });
  req.logger.info({ status: 'start' });

  try {
    const { idUser } = req.params;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deleteUserUtil(idUser);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
