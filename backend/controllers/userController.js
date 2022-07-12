const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// @desc   Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //Validation
    if(!name || !email || !password) {
        return res.status(400)
    }

    // Find if user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({
            msg: 'User already exists'
        })
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user){
        res.status(201).json({
            msg: 'User created successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400).json({
            msg: 'User not created, invalid data'
        })
    }
})

// @desc   Login a user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //Validate user - check passwords match
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        })
    } else {
        res.status(401).json({
            msg: 'Invalid credentials'
        })
    }

})

// @desc   Get current User
// @route /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
})

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })}

module.exports = {
    registerUser,
    loginUser,
    getMe
}