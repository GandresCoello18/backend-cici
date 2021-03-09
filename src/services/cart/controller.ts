import { format } from 'date-fns';
import { Request, Response } from 'express';
import { Cart, CartProduct } from '../../models/cart';
import { v4 as uuidv4 } from 'uuid';
import { createCartProductUtil, createCartUtil, DeleteProductCart, getStatusCartUserUtil, ExistProductCart, getProductCartUserUtil, UpdateProductCart } from '../../utils/cart';
// import { dataBase } from '../../utils';

export const newProductCart = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'cart', serviceHandler: 'newProductCart' });
    req.logger.info({ status: 'start' });

    try {
        const {idProduct, quantity} = req.body
        const user = req.user

        if(!idProduct && !quantity){
            const response = { status: 'No product for cart provided' };
            req.logger.warn(response);
            return res.status(400).send(response);
        }

        const existCart = await getStatusCartUserUtil(user.idUser, 'Pending')

        const AddProductCart = async (idCart?: string) => {
            const cartProduct: CartProduct = {
                id_cart_product: uuidv4(),
                idProduct,
                quantity,
                idCart: idCart || existCart[0].idCart,
            }

            await createCartProductUtil(cartProduct)
        }

        if(existCart.length){
            const existProduct = await ExistProductCart(existCart[0].idCart, idProduct)

            if (existProduct.length) {
                const SumQuantity: number = existProduct[0].quantity + Number(quantity)
                UpdateProductCart(existCart[0].idCart, idProduct, SumQuantity)
            } else {
                AddProductCart()
            }

        }else{
            const cart: Cart = {
                idCart: uuidv4(),
                created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                status: 'Pending',
                idUser: user.idUser
            }

            createCartUtil(cart).then( () => AddProductCart(cart.idCart))
        }

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getProductCart = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'cart', serviceHandler: 'getProductCart' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user
        const products = await getProductCartUserUtil(user.idUser, 'Pending')

        return res.status(200).json({ products });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const deleteProductCart = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'cart', serviceHandler: 'deleteProductCart' });
    req.logger.info({ status: 'start' });

    try {
        const { idProduct } = req.params
        const user = req.user

        if(!idProduct){
            const response = { status: 'No product id for cart provided' };
            req.logger.warn(response);
            return res.status(400).send(response);
        }

        const ExistCart = await getStatusCartUserUtil(user.idUser, 'Pending')

        if(ExistCart.length){
            await DeleteProductCart(ExistCart[0].idCart, idProduct)
            return res.status(200).json();
        }else{
            const response = { status: 'Error delete product in cart' };
            req.logger.warn(response);
            return res.status(400).send(response);
        }

    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}