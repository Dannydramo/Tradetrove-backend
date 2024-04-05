import index from './index';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;

const DB = process.env.MONGODB_URL!.replace(
    '<PASSWORD>',
    process.env.MONGODB_PASSWORD!
);

mongoose.connect(DB).then(() => {
    console.log('Connection Successful');
});

index.listen(port, () => {
    console.log(`app runnning on port ${port}`);
});
