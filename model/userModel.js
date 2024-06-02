const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    profile: {
        points: { type: Number, default: 0 },
        membership: { type: String, default: 'free' },
        badges: [String]
    }
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id,  username: this.username, membership: this.profile.membership },
        process.env.JWT_PRIVATE_KEY
    );
    return token;
};

UserSchema.methods.validatePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
