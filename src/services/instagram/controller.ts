import { Request, Response } from 'express';
import Instagram from 'node-instagram';
import { config } from '../../utils/config';

const instagram = new Instagram({
  clientId: config.CLIENT_ID_INSTAGRAM,
  clientSecret: config.SECRET_ID_INSTAGRAM,
});

const redirectUri = 'https://a7ebf93e5ff5.ngrok.io/api/instagram/auth';

export const profileInstagram = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'instagram', serviceHandler: 'profileInstagram' });
  req.logger.info({ status: 'start' });

  try {
    res.redirect(
      instagram.getAuthorizationUrl(redirectUri, {
        scope: ['basic', 'likes'],
        state: 'you state',
      }),
    );

    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const instagramAuth = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'instagram', serviceHandler: 'instagramAuth' });
  req.logger.info({ status: 'start' });

  try {
    console.log('desde el redirect inst');
    const code = req.query.code as string;
    const data = await instagram.authorizeUser(code, redirectUri);
    console.log(data);
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
