const Joi = require('joi');

function validateUser(user) {
    const userSchema = Joi.object({
        name: Joi.string().required(),
        gender: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().optional()
    });

    return userSchema.validate(user);
}

module.exports = validateUser;
