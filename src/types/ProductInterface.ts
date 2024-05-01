import mongoose, { Document } from 'mongoose';

export interface ProductTypes extends Document {
    vendor: mongoose.Types.ObjectId;
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}
