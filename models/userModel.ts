import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UserTypes } from '../types/UserInterface';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User name is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Please provide a valid email'],
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
            validator: function (this: UserTypes, el: string) {
                return el === this.password;
            },
            message: 'Password must be the same with Confirm Password',
        },
    },
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
    passwordChangedAt: Date,
});
userSchema.pre<UserTypes>('save', async function (next: () => void) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password!, 12);
    this.confirmPassword = undefined;
    next();
});
userSchema.methods.correctPassword = function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimeAt = Math.floor(
            this.passwordChangedAt.getTime() / 1000
        );
        return JWTTimestamp < changedTimeAt;
    }
    return false;
};

export default mongoose.model<UserTypes>('User', userSchema);
