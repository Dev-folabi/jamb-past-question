const User = require("../../model/userModel");
const { dataRequest, airtimeRequest } = require("../../utils/vtu");

// Data Reward
exports.dataReward = async (req, res) => {
    try {
        const { network, phone, dataPlan } = req.body;
        if (!network || !phone || !dataPlan) {
            return res.status(400).json({ error: "Network, Phone-No, Data-Plan are required" });
        }

        let pointsTOReward;

        switch(dataPlan) {
            case "500MB":
                pointsTOReward = 2500;
                break;
            case "1GB":
                pointsTOReward = 5000;
                break;
            case "2GB":
                pointsTOReward = 10000;
                break;
            case "3GB":
                pointsTOReward = 15000;
                break;
            default:
                throw new Error('Unsupported Data plan');
        }

        // Find User
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Get User Current Point
        const userPoint = user.profile.points;

        // Check Point Conversion
        if (pointsTOReward > userPoint) return res.status(404).json({ msg: `Reward Failed!! ${pointsTOReward} Points needed` });

        const data = await dataRequest(network, phone, dataPlan);

        // Check Data Request Status
        if (data.status == "fail") return res.status(400).json({ msg: "Server error" });

        // Update User Profile 
        user.profile.rewardCount += 1;
        user.profile.points -= pointsTOReward;
        user.profile.withdrawReward += pointsTOReward;

        user.reward.push({ points: pointsTOReward, type: "Data", amount: dataPlan });

        await user.save();

        res.status(200).json({ msg: "Reward Successful", reward: user.reward });
    } catch (err) {
        res.status(500).json({ msg: "Reward Failed", Error: err.message });
    }
};

// Airtime Reward
exports.airtimeReward = async (req, res) => {
    try {
        const { network, phone, amount } = req.body;
        if (!network || !phone || !amount) {
            return res.status(400).json({ error: "Network, Phone-No, Amount are required" });
        }

        let pointsTOReward;

        switch(amount) {
            case 100:
                pointsTOReward = 500;
                break;
            case 200:
                pointsTOReward = 1000;
                break;
            case 500:
                pointsTOReward = 2500;
                break;
            case 1000:
                pointsTOReward = 5000;
                break;
            default:
                throw new Error('Unsupported Airtime plan');
        }

        // Find User
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Get User Current Point
        const userPoint = user.profile.points;

        // Check Point Conversion
        if (pointsTOReward > userPoint) return res.status(404).json({ msg: `Reward Failed!! ${pointsTOReward} Points needed` });

        const airtime = await airtimeRequest(network, phone, amount);

        // Check Data Request Status
        if (airtime.status == "fail") return res.status(400).json({ msg: "Server error" });

        // Update User Profile 
        user.profile.rewardCount += 1;
        user.profile.points -= pointsTOReward;
        user.profile.withdrawReward += pointsTOReward;

        user.reward.push({ points: pointsTOReward, type: "Airtime", amount });

        await user.save();

        res.status(200).json({ msg: "Reward Successful", reward: user.reward });
    } catch (err) {
        res.status(500).json({ msg: "Reward Failed", Error: err.message });
    }
};

// Get Reward
exports.getReward = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const reward = user.reward;

        res.status(200).json({ msg: "success", reward });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
};
