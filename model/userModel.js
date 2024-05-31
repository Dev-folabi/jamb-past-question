const { required } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
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

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

const user = mongoose.model('User', UserSchema);

module.exports = user
