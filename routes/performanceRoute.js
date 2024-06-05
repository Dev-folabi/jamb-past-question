const express = require('express');
const { postPerformance, getPerformance } = require('../api/controller/performanceController');
const router = express.Router();

router.post('/:id', postPerformance); 
router.get('/:id', getPerformance); 

module.exports = router;
