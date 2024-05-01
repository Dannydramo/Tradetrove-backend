import Product from '../models/productModel';
import Order from '../models/orderModel';
import mongoose from 'mongoose';

export const calculateTotalUsersForVendor = async (
    vendorId: string
): Promise<number> => {
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

export const calculateTotalSalesForVendor = async (
    vendorId: string
): Promise<number> => {
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

export const calculateTotalAmount = async (
    vendorId: string
): Promise<number> => {
    try {
        const totalAmountResult = await Order.aggregate([
            { $match: { vendor: vendorId } },
            { $group: { _id: null, totalAmount: { $sum: '$totalPrice' } } },
        ]);

        return totalAmountResult.length > 0
            ? totalAmountResult[0].totalAmount
            : 0;
    } catch (error) {
        console.error('Error calculating total amount:', error);
        throw new Error('Failed to calculate total amount');
    }
};

export const calculateTotalProductsForVendor = async (
    vendorId: string
): Promise<number> => {
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
