const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Mailjet = require('node-mailjet')

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '969d6b9b6d05d784e36f0b9a860e2192',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || '03777565c5624c11b4e68ec14e7a6bde'
});

const User = require('../models/userModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  }
  res.status(200).json(user)
})

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  console.log('forgotPassword called with email:', req.body.email); // Log when function is called
  const { email } = req.body;

    console.log('Attempting to find user by email');
    const user = await User.findOne({ email: req.body.email });
    console.log('User found:', user);

    if (!user) {
      console.log('User not found, sending 404 response');
      res.status(404);
      throw new Error('User not found');
    }

    console.log('Creating reset token');
  // 2. Creating a reset token (could be a JWT or a random byte string)
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token (optional but recommended)
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token to the database (pseudo-code, depends on your User model)
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour from now

  console.log('Saving user with reset token');
    await user.save();

    console.log('Preparing email data');

  // 3. Saving the token to the database (handled above)

  // 4. Sending an email to the user with the reset link
  const resetUrl = `http://<frontend-url>/reset-password/${resetToken}`;

  try {
    console.log('Sending email via Mailjet'); // Log before sending the email

    // Send the email using Mailjet
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "tylerlovell@gmail.com",
            Name: "Ticket Support by Tyler Lovell"
          },
          To: [
            {
              Email: email,
              Name: user.name
            }
          ],
          Subject: "Password Reset",
          TextPart: "Please click the link below to reset your password:",
          HTMLPart: `<p>Please click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        }
      ]
    });
    console.log('Sending email via Mailjet');
    const response = await request;
    console.log('Email sent successfully:', response.body);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Failed to send password reset email', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: 'Error sending password reset email' });
  }
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// ... other imports and code ...

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token from the URL
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find the user by the hashed token and make sure the token has not expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Set the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear the resetPasswordToken and resetPasswordExpire fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send a response or you can log the user in directly
  res.status(200).json({
    message: 'Password reset successful',
    // If you want to log the user in directly, generate a token and send it back
    // token: generateToken(user._id),
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
}

