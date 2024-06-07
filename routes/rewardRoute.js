const express = require('express')
const { reward, getReward } = require('../api/controller/rewardController')
const router = express.Router()

router.post('/:id', reward);
router.get('/:id', getReward);

module.exports = router 