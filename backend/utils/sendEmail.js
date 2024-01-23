// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/new-ticket' element={<PrivateRoute />}>
          <Route path='/new-ticket' element={<NewTicket />} />
        </Route>
        <Route path='/tickets' element={<PrivateRoute />}>
          <Route path='/tickets' element={<Tickets />} />
        </Route>
        <Route path='/ticket/:ticketId' element={<PrivateRoute />}>
          <Route path='/ticket/:ticketId' element={<Ticket />} />
        </Route>
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/userController');

// ... other route handlers ...

// Forgot password route
router.post('/forgot-password', forgotPassword);

module.exports = router;

// backend/controllers/userController.js
const crypto = require('crypto'); // Node.js module for generating random bytes

// ... other imports ...

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Verifying the user's email exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

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

  await user.save();

  // 3. Saving the token to the database (handled above)

  // 4. Sending an email to the user with the reset link
  const resetUrl = `http://<frontend-url>/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    // Send email (pseudo-code, you'll need a mailer service)
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// ... other functions ...

module.exports = {
  // ... other exported functions ...
  forgotPassword,
};

// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    // ... other fields ...
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpire: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
