const User = require('../../model/userModel');

const postPerformance = async (req, res) => {
    try {
        const { subject, score } = req.body;
        const user = await User.findById(req.params.id); 
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const points = score;
        
        user.profile.points += points;
        user.performance.push({ subject, score, points });

        await user.save();

        res.status(201).json({ points: user.profile.points, performance: user.performance });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};

const getPerformance = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const points = user.profile.points;
        const performance = user.performance;

        res.status(200).json({ points, performance }); 
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};

module.exports = {
    postPerformance,
    getPerformance
};
