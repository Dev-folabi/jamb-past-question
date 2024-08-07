const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {type: String},
    profile: {
        withdrawReward: {type: Number, default: 0},
        points: { type: Number, default: 0 },
        membership: { type: String, default: 'Free' },
        badges: [String],
        rewardCount: {type: Number, default: 0}
    },
    performance: [{
        subject: { type: String },
        score: { type: Number },
        points: { type: Number },
        createdAt: { type: Date, default: Date.now }
    }],
    reward: [{
        points: { type: Number },
        type: { type: String },
        amount: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, username: this.username, membership: this.profile.membership },
        process.env.JWT_PRIVATE_KEY
    );
    return token;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
