const express = require('express')
const {  getReward, dataReward, airtimeReward } = require('../api/controller/rewardController')
const router = express.Router()

router.post('/data/:id', dataReward);

router.post('/airtime/:id', airtimeReward);

router.get('/:id', getReward);

module.exports = router 