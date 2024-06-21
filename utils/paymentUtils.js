const express = require('express');
const User = require('../model/userModel');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL;
const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY;
const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY;
const MONNIFY_CONTRACT_CODE = process.env.MONNIFY_CONTRACT_CODE;

const DEV_REDIRECT_URL = process.env.DEV_REDIRECT_URL;
const PROD_REDIRECT_URL = process.env.PROD_REDIRECT_URL;

const REDIRECT_URL = process.env.NODE_ENV === 'production' ? PROD_REDIRECT_URL : DEV_REDIRECT_URL;

// Helper function to get auth token
const getAuthToken = async () => {
    const auth = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`).toString('base64');
    try {
        const response = await axios.post(`${MONNIFY_BASE_URL}/auth/login`, {}, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.responseBody.accessToken;
    } catch (error) {
        console.error('Error fetching auth token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch auth token');
    }
};

// Function to generate a random payment reference
function generateRandompayRef(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let paymentRef = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        paymentRef += characters.charAt(randomIndex);
    }

    return paymentRef;
}

// Route to initialize a transaction
router.post('/initialize-transaction/:id', async (req, res) => {
    try {
        const { customerName, customerEmail } = req.body;

        // Check for required fields
        if (!customerName || !customerEmail) {
            return res.status(400).json({ error: 'customerName and customerEmail are required fields' });
        }

        // Generate a random payment reference
        const paymentRef = generateRandompayRef(10);

        const authToken = await getAuthToken();

        const response = await axios.post(`${MONNIFY_BASE_URL}/merchant/transactions/init-transaction`, {
            amount: 1000.0,
            customerName,
            customerEmail,
            paymentReference: paymentRef,
            paymentDescription: "Jamb past question",
            currencyCode: "NGN",
            contractCode: MONNIFY_CONTRACT_CODE,
            redirectUrl: `${REDIRECT_URL}/${req.params.id}`, 
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"]
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (response.data.requestSuccessful) {
            res.status(200).json(response.data.responseBody.checkoutUrl);
        } else {
            console.error('Monnify error response:', response.data);
            res.status(500).json({ error: response.data.responseMessage || 'An error occurred' });
        }
    } catch (error) {
        console.error('Error initializing transaction:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while initializing the transaction' });
    }
});



// Route to handle the redirect after payment
router.get('/payment-response/:id', async (req, res) => {
    const { paymentReference } = req.query;

    if (!paymentReference) {
        return res.status(400).json({ error: 'Payment reference required' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const authToken = await getAuthToken();

        const response = await axios.get(`${MONNIFY_BASE_URL}/merchant/transactions/query?paymentReference=${paymentReference}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (response.data.requestSuccessful) {
            const paymentStatus = response.data.responseBody.paymentStatus;

            if (paymentStatus === 'PAID') {
                user.profile.membership = 'premium';
                await user.save();

                res.redirect('https://www.jambfocus.com/admin/profile');
            } else {
                res.status(500).redirect('https://www.jambfocus.com/admin/profile');
            }
        } else {
            console.error('Monnify error response:', response.data);
            res.status(500).json({ error: response.data.responseMessage || 'An error occurred' });
        }
    } catch (error) {
        console.error('Error handling payment response:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while processing the payment response' });
    }
});











// router.get('/payment-response/:id', async (req, res) => {
//     const { paymentReference } = req.query;

//     if (!paymentReference ) {
//         return res.status(400).json({ error: 'Payment reference required' });
//     }

//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         if (paymentStatus === 'success') {
//             user.profile.membership = 'premium';
//             await user.save();
//             res.json({ message: 'Payment successful', membership: user.profile.membership });
//         } else {
//             res.send('Payment failed');
//         }
//     } catch (error) {
//         console.error('Error handling payment response:', error);
//         res.status(500).json({ error: 'An error occurred while processing the payment response' });
//     }
// });

module.exports = router;
