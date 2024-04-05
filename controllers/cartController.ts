import { Request, Response, NextFunction } from 'express';
import ShoppingCart from '../models/cartModel';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';

export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        let cart = await ShoppingCart.findOne({ user: userId });

        if (!cart) {
            cart = await ShoppingCart.create({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex !== -1) {
            // If the product is already in the cart, update its quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // If the product is not in the cart, add it as a new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        return ApiResponse(
            200,
            res,
            'Item added to cart successfully',
            'success',
            cart
        );
    } catch (error) {
        return next(new AppError('Failed to add item to cart', 500));
    }
};

export const removeFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id; // Assuming user ID is stored in req.user._id

        const cart = await ShoppingCart.findOne({ user: userId });

        if (!cart) {
            return next(new AppError('Shopping cart not found', 404));
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        return ApiResponse(
            200,
            res,
            'Item removed from cart successfully',
            'success',
            cart
        );
    } catch (error) {
        return next(new AppError('Failed to remove item from cart', 500));
    }
};
