const User = require('../../model/userModel');

// Post Reward
const reward = async (req, res) => {
    try {
        const { points, type, amount } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.profile.rewardCount += 1;
        user.profile.points -= points;
    user.profile.totalReward += points;

        user.reward.push({points, type, amount})
    
        await user.save();

        res.status(200).json({ msg: 'success', reward: user.reward });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};



// Get Reward

const getReward = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const reward = user.reward

        res.status(200).json({ msg: 'success', reward });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};

module.exports = {
    reward,
    getReward
};
