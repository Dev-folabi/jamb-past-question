const express = require('express');
const mongoDB = require('./db/dbconnection');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
    process.exit(1);
}

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes
app.use('/api/user', require('./routes/usersRoute'));
app.use('/api/performance', require('./routes/performanceRoute'));
app.use('/api/reward', require('./routes/rewardRoute'));
app.use('/api/payment', require('./utils/paymentUtils'));
// app.use('/api/reward/', require('./routes/vtuRoute'));

mongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});
