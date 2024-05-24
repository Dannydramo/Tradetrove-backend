const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

const calculateTotalUsersForVendor = async (vendorId) => {
    try {
        const totalUsersResult = await Order.aggregate([
            { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
            { $group: { _id: '$user' } },
            { $count: 'totalUsers' },
        ]);

        return totalUsersResult.length > 0 ? totalUsersResult[0].totalUsers : 0;
    } catch (error) {
        console.error('Error calculating total users for vendor:', error);
        throw new Error('Failed to calculate total users for vendor');
    }
};

const calculateTotalSalesForVendor = async (vendorId) => {
    try {
        const totalSalesResult = await Order.aggregate([
            { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
        ]);

        return totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;
    } catch (error) {
        console.error('Error calculating total sales for vendor:', error);
        throw new Error('Failed to calculate total sales for vendor');
    }
};

const calculateTotalAmount = async (vendorId) => {
    try {
        const totalAmountResult = await Order.aggregate([
            { $match: { vendor: vendorId } },
            { $group: { _id: null, totalAmount: { $sum: '$totalPrice' } } },
        ]);
        console.log(totalAmountResult);
        return totalAmountResult.length > 0
            ? totalAmountResult[0].totalAmount
            : 0;
    } catch (error) {
        console.error('Error calculating total amount:', error);
        throw new Error('Failed to calculate total amount');
    }
};

const calculateTotalProductsForVendor = async (vendorId) => {
    try {
        const totalProducts = await Product.countDocuments({
            vendor: vendorId,
        });
        return totalProducts;
    } catch (error) {
        console.error('Error calculating total products for vendor:', error);
        throw new Error('Failed to calculate total products for vendor');
    }
};

module.exports = {
    calculateTotalUsersForVendor,
    calculateTotalSalesForVendor,
    calculateTotalProductsForVendor,
};
