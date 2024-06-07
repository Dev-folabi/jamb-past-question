// const axios = require('axios');

// require('dotenv').config()

// // API credentials
// const API_KEY = process.env.API_KEY;
// const API_TOKEN = process.env.API_TOKEN;

// // Endpoint to recharge airtime
// const airtime = async (req, res) => {
//     // Extract parameters from request body
//     const { operator, type, value, phone } = req.body;
    
//     // Prepare the request data
//     const data = {
//         operator: operator,
//         type: type || 'airtime',
//         value: value ,
//         phone: phone 
//     };

//     // Prepare request headers
//     const headers = {
//         'Api-Token': API_TOKEN,
//         'Request-Id': Date.now().toString(),
//         'Content-Type': 'application/x-www-form-urlencoded'
//     };

//     try {
//         // Send POST request to the API
//         const response = await axios.post(`https://api.mobilevtu.com/v1/${API_KEY}/topup`, new URLSearchParams(data), { headers });
        
//         // Parse the JSON response
//         const json_output = response.data;
        
//         if (json_output.status === 'success') {
//             // If request was successful, respond with transaction details
//             res.json({
//                 transaction_reference: json_output.data.transaction_id,
//                 transaction_status: json_output.data.transaction_status
//             });
//         } else {
//             // If there was an error, respond with the error message
//             res.status(400).send(json_output.message);
//         }
//     } catch (error) {
//         // Handle connection errors
//         res.status(500).send('Connection error occurred! ' + error.message);
//     }
// }


// // Endpoint to buy data subscription

// const data = async (req, res) => {
// const {network_id, mobile_number, plan_id } = req.body

//     try {
//         const data = `{"network":${network_id},\r\n"mobile_number":${mobile_number},\r\n"plan": ${plan_id},\r\n"Ported_number":true\r\n}`;
        
//         const config = {
//           method: 'post',
//         maxBodyLength: Infinity,
//           url: 'https://vtukonnect.com/api/data/',
//           headers: { 
//             'Authorization': 'Token  b28c052c8a2a4838ae11e06444550011d0f80cb3', 
//             'Content-Type': 'application/json'
//           },
//           data : data
//         };
        
//         axios(config)
//         .then(function (response) {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
        
        
//     } catch (error) {
//         // Handle connection errors
//         res.status(500).send('Connection error occurred! ' + error.message);
//     }
// }


// // const data = async (req, res) => {
// //     // Extract parameters from request body
// //     const { operator, type, value, phone } = req.body;

// //     // Prepare the request data
// //     const data = {
// //         operator: operator,
// //         type: type || 'data',
// //         value: value ,
// //         phone: phone 
// //     };

// //     // Prepare request headers
// //     const headers = {
// //         'Api-Token': API_TOKEN,
// //         'Request-Id': Date.now().toString(),
// //         'Content-Type': 'application/x-www-form-urlencoded'
// //     };

// //     try {
// //         // Send POST request to the API
// //         const response = await axios.post(`https://api.mobilevtu.com/v1/${API_KEY}/topup`, new URLSearchParams(data), { headers });
        
// //         // Parse the JSON response
// //         const json_output = response.data;
        
// //         if (json_output.status === 'success') {
// //             // If request was successful, respond with transaction details
// //             res.json({
// //                 transaction_reference: json_output.transaction_id,
// //                 transaction_status: json_output.transaction_status
// //             });
// //         } else {
// //             // If there was an error, respond with the error message
// //             res.status(400).send(json_output.message);
// //         }
// //     } catch (error) {
// //         // Handle connection errors
// //         res.status(500).send('Connection error occurred! ' + error.message);
// //     }
// // }


// module.exports = {
//     airtime,
//     data
// }