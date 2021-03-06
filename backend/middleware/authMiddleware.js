const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    //Bearer token sent from the client
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
        try{
            //splits it at Bearer and returns the token
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

        } catch(err){
            console.log(err);
            res.status(401)
            throw new Error('Not authorized');
        }
         // Check if token is not present
        if (!token) {
            res.status(401)
            throw new Error('Not authorized');
        }
    }
})

module.exports = protect;
    
