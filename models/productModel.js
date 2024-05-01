const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    inStock: {
        type: Boolean,
    },
    images: {
        type: [String],
        required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model('Product', productSchema);
