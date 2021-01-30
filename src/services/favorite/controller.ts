import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Favorite } from '../../models/favorite';
import { dataBase } from '../../utils';

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

        const favorites: Favorite[] = await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT * FROM favorite_product WHERE idProduct = '${idProduct}' AND idUser = '${user.idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json({ isFav: favorites.length ? true : false});
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

        interface Count {
            COUNT: number
        }

        const CountFav: Count[]  = await new Promise((resolve, reject) => {
            dataBase.query(
                `SELECT COUNT(*) as COUNT FROM favorite_product WHERE idProduct = '${idProduct}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });

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

        const FavoriteExit: Favorite[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM favorite_product WHERE idProduct = '${idProduct}' AND idUser = '${user.idUser}';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        if(FavoriteExit.length === 0){
            const favorite: Favorite = {
                id_favorite_product: uuidv4(),
                idProduct,
                idUser: user.idUser,
                created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            }

            await new Promise((resolve, reject) => {
                dataBase.query(
                  `INSERT INTO favorite_product (id_favorite_product, idProduct, idUser, created_at) VALUES ('${favorite.id_favorite_product}', '${favorite.idProduct}', '${favorite.idUser}', '${favorite.created_at}');`,
                  (err, data) => err ? reject(err) : resolve(data)
                );
            });
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

        await new Promise((resolve, reject) => {
            dataBase.query(
                `DELETE FROM favorite_product WHERE idProduct = '${idProduct}' AND idUser = '${user.idUser}';`,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
