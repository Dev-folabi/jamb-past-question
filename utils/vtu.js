const axios = require('axios');
require('dotenv').config();

const authToken = process.env.N3TDATA_TOKEN;

if (!authToken) {
    console.error('Missing N3TDATA_TOKEN environment variable');
    process.exit(1);
}

// Function to generate a random request-id
function generateRequestId(length) {
    const characters = '0123456789';
    let requestId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        requestId += characters.charAt(randomIndex);
    }

    return requestId;
}

// Data Request Function
exports.dataRequest = async (network, phone, dataPlan) => {
    try {
        let networkPlan;
        let dataPlanId;

        switch (network) {
            case "MTN":
                networkPlan = 1;
                break;
            case "AIRTEL":
                networkPlan = 2;
                break;
            case "GLO":
                networkPlan = 3;
                break;
            case "9MOBILE":
                networkPlan = 4;
                break;
            default:
                throw new Error('Unsupported network');
        }

        switch (dataPlan) {
            case "500MB":
                dataPlanId = 69;
                break;
            case "1GB":
                dataPlanId = 68;
                break;
            case "2GB":
                dataPlanId = 67;
                break;
            case "3GB":
                dataPlanId = 66;
                break;
            default:
                throw new Error('Unsupported data plan');
        }

        const requestId = generateRequestId(11);
        const payload = {
            network: networkPlan,
            phone,
            data_plan: dataPlanId,
            bypass: false,
            'request-id': `Data_${requestId}`
        };

        const response = await axios.post(
            'https://n3tdata.com/api/data',
            payload,
            {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Data:", response.data);

        return response.data;
    } catch (error) {
        console.error('Error sending data request:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Airtime Request Function
exports.airtimeRequest = async (network, phone, amount) => {
    try {
        let networkPlan;

        switch (network) {
            case "MTN":
                networkPlan = 1;
                break;
            case "AIRTEL":
                networkPlan = 2;
                break;
            case "GLO":
                networkPlan = 3;
                break;
            case "9MOBILE":
                networkPlan = 4;
                break;
            default:
                throw new Error('Unsupported network');
        }

        const requestId = generateRequestId(11);
        const payload = {
            network: networkPlan,
            phone,
            plan_type: "VTU",
            bypass: false,
            amount,
            'request-id': `Airtime_${requestId}`
        };

        const response = await axios.post(
            'https://n3tdata.com/api/topup',
            payload,
            {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Airtime:", response.data);

        return response.data;
    } catch (error) {
        console.error('Error sending Airtime request:', error.response ? error.response.data : error.message);
        throw error;
    }
}
