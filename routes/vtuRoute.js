const express = require('express');
const { data } = require('../utils/vtu');
const router = express.Router()

router.post('/data', data)

module.exports = router