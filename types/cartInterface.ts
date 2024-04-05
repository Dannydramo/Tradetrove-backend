import mongoose, { Document } from 'mongoose';

interface Item {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ShoppingCartDoc extends Document {
    user: mongoose.Types.ObjectId;
    items: Item[];
    createdAt: Date;
}
