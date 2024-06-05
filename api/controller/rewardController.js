const User = require('../../model/userModel');

// Earn Points
const earnPoints = async (req, res) => {
    try {
        const { _Id, points } = req.body;
        const user = await User.findById(_Id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.profile.points += points;
        await user.save();

        res.status(200).json({ msg: 'Points added successfully', points: user.profile.points });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};



// Redeem Points
const redeemPoints = async (req, res) => {
    try {
        const { _Id, type, amount } = req.body; 
        const user = await User.findById(_Id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        
        const membershipLimits = {
            free: { maxRedeem: 100 },
            premium: { maxRedeem: 500 }
        };

        const userLimit = membershipLimits[user.profile.membership];
        if (amount > userLimit.maxRedeem) return res.status(400).json({ msg: `Redemption limit exceeded for ${user.profile.membership} membership` });

        if (user.profile.points < amount) return res.status(400).json({ msg: 'Insufficient points' });

        user.profile.points -= amount;
        await user.save();

        res.status(200).json({ msg: `${amount} points redeemed for ${type}`, points: user.profile.points });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};

module.exports = {
    earnPoints,
    redeemPoints
};
