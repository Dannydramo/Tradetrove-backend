import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { VendorTypes } from '../types/VendorInterface';

const vendorSchema = new mongoose.Schema({
    businessName: {
        type: String,
        unique: true,
        required: [true, 'Business name is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: 6,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required'],
        min: 6,
        validate: {
            validator: function (this: VendorTypes, el: string) {
                return el === this.password;
            },
            message: 'Password must be the same with Confirm Password',
        },
    },
    logo: String,
    address: String,
    phoneNumber: String,
    city: String,
    state: String,
    country: String,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: null,
    },
});

vendorSchema.pre<VendorTypes>('save', async function (next: () => void) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password!, 12);
    this.confirmPassword = undefined;
    next();
});

vendorSchema.methods.correctPassword = function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, userPassword);
};

vendorSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimeAt = Math.floor(
            this.passwordChangedAt.getTime() / 1000
        );
        return JWTTimestamp < changedTimeAt;
    }
    return false;
};
export default mongoose.model<VendorTypes>('Vendor', vendorSchema);
