import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Favorite } from '../../models/favorite';
import { deleteAllFavoriteUtil, deletetFavoriteUtil, getMyProductsFavoriteUtil, getProductFavoriteUtil, getProductsFavoriteCountByUserUtil, getProductsFavoriteCountUtil, getProductsFavoriteUtil, insertFavoriteUtil } from '../../utils/favorite';

export const getFavoriteProduct = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'getFavoriteProduct' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct} = req.params
        const user = req.user

        if(!idProduct){
            const response = { status: 'No product id provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const favorites = await getProductFavoriteUtil(idProduct,user.idUser )

        return res.status(200).json({ isFav: favorites.length || false});
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getFavoriteByUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'getFavoriteByUser' });
    req.logger.info({ status: 'start' });

    try {
        const { idUser } = req.params

        if(!idUser){
            const response = { status: 'No id User provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

       const products = await getProductsFavoriteUtil(idUser)

        products.map(product => product.created_at = format(new Date(product.created_at), 'yyyy-MM-dd'))

        return res.status(200).json({ products });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getMyFavoritesProducts = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'getMyFavoritesProducts' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user
        const page = req.query.page as string;
        let pages = 0;
        let start = 0;

        if(Number(page)){
            const totalFavorites = await getProductsFavoriteCountByUserUtil(user.idUser);
            pages = Math.trunc(totalFavorites[0].totalFavorites)

            if(Number(page) > 1){
              start = Math.trunc((Number(page) -1) * 15)
            }
        }

        const favorites = await getMyProductsFavoriteUtil(user.idUser, start)

        return res.status(200).json({ favorites, pages });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getFavoriteProductCount = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'getFavoriteProductCount' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct} = req.params

        if(!idProduct){
            const response = { status: 'No product id provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const CountFav = await getProductsFavoriteCountUtil(idProduct)

        return res.status(200).json({ count: CountFav[0].COUNT });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const createFavorite = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'createFavorite' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct} = req.body
        const user = req.user

        if(!idProduct){
            const response = { status: 'No product id provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const FavoriteExit = await getProductFavoriteUtil(idProduct, user.idUser);

        if(FavoriteExit.length === 0){
            const favorite: Favorite = {
                id_favorite_product: uuidv4(),
                idProduct,
                idUser: user.idUser,
                created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            }

            await insertFavoriteUtil(favorite)
        }

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const deleteFavorite = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'deleteFavorite' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct} = req.params
        const user = req.user

        if(!idProduct){
            const response = { status: 'No product id provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await deletetFavoriteUtil(idProduct, user.idUser)

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const deleteAllMyFavorites = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'deleteAllMyFavorites' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user

        await deleteAllFavoriteUtil(user.idUser)

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
