const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
            validator: function (el) {
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
    description: String,
    coverImage: String,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            select: false,
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

vendorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

vendorSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

vendorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeAt = Math.floor(
            this.passwordChangedAt.getTime() / 1000
        );
        return JWTTimestamp < changedTimeAt;
    }
    return false;
};

module.exports = mongoose.model('Vendor', vendorSchema);
