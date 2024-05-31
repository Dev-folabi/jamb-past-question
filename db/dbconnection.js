const mongoose = require('mongoose')
const dotenv = require('dotenv')

require('dotenv').config()

const dbURI = process.env.MONGO_URI;

const dbconnection = async ()=>{
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
}

module.exports = dbconnection