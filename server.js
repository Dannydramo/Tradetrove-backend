const index = require('./index');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const setupSocket = require('./socket/socketSetup');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;

const DB = process.env.MONGODB_URL.replace(
    '<PASSWORD>',
    process.env.MONGODB_PASSWORD
);

mongoose.connect(DB).then(() => {
    console.log('Connection Successful');
});

const server = index.listen(port, () => {
    console.log(`app running on port ${port}`);
});
setupSocket(server);
