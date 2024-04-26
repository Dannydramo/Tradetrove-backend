import index from './index';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import setupSocket from './socket/socketSetup';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;

const DB = process.env.MONGODB_URL!.replace(
    '<PASSWORD>',
    process.env.MONGODB_PASSWORD!
);

mongoose.connect(DB).then(() => {
    console.log('Connection Successful');
});

const server = index.listen(port, () => {
    console.log(`app runnning on port ${port}`);
});
setupSocket(server);
