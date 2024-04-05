import mongoose from 'mongoose';
import { ShoppingCartDoc } from '../types/cartInterface';

const { Schema } = mongoose;

const shoppingCartSchema = new Schema<ShoppingCartDoc>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ShoppingCart = mongoose.model<ShoppingCartDoc>(
    'Cart',
    shoppingCartSchema
);

export default ShoppingCart;
