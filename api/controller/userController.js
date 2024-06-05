const User = require('../../model/userModel');
const validateUser = require('../validator/validateUser');
const bcrypt = require('bcrypt');
const _ = require('lodash');

// Register User
const registerUser = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, gender, username, email, password, phone } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email already exists' });

        let userName = await User.findOne({ username });
        if (userName) return res.status(400).json({ msg: 'Username already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, gender, username, email, password: hashedPassword, phone });

        await user.save();

        const token = user.generateAuthToken();
        const picked = _.pick(user, ['name', 'gender', 'username', 'email', 'phone', 'profile']);

        res.status(201).json({ msg: 'User registered successfully', token, user: picked });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const userEmail = await User.findOne({ email });
        const userName = await User.findOne({ username });

        if (!userEmail && !userName) return res.status(400).json({ msg: 'Invalid email or password' });

        const user = userEmail || userName;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

        const token = user.generateAuthToken();

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', err });
    }
}

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('profile name email username');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const picked = _.pick(user, ['name', 'gender', 'username', 'email', 'phone', 'profile']);

        res.status(200).json(picked);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    registerUser,
    login,
    getUserProfile
};
