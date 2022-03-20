const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({email: req.body.email})
        .exec((error, user) => {
            if (user) {
                return res.status(400).json({
                    message: `User with email ${user.email} is already registered.`
                });
            }

            const {
                firstName,
                lastName,
                email,
                password
            } = req.body;

            const _user = new User({
                firstName,
                lastName,
                email,
                password,
                username: Math.random().toString()
            });

            _user.save((error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: 'Something went wrong.'
                    });
                }

                if (data) {
                    return res.status(200).json({
                        message: 'User created successfully.'
                    });
                }
            });
        });
}

exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({email: email})
        .exec((error, user) => {
            if (error) {
               return res.status(400).json({ error });
            }

            if (user) {
                if (user.authenticate(password)) {
                    const token = jwt.sign(
                        { _id: user._id, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h'}
                    )

                    const {
                        _id,
                        firstName,
                        lastName,
                        fullName,
                        email,
                        role
                    } = user;

                    res.status(200).json({
                      token,
                      user: {
                            _id,
                            firstName,
                            lastName,
                            fullName,
                            email,
                            role
                      }
                    });
                } else {
                    return res.status(400).json({
                        message: 'Invalid Password.'
                    });
                }

            } else {
                return res.status(400).json({ 
                    message: 'Something went wrong.'
                });
            }
        });
}