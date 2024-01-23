import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../features/auth/authSlice'; // Import the action creator
import { unwrapResult } from '@reduxjs/toolkit'; // Import unwrapResult

import emailjs from 'emailjs-com';

import { useLocation } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const { token } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userEmail = queryParams.get('email'); // Get the email from the query string

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Handle password mismatch
      console.error('Passwords do not match');
      return;
    }
    // Prepare the template parameters
    const templateParams = {
      user_email: userEmail, // The email of the user who requested the password reset
      reset_link: `https://tyloticketingsupportdesk.herokuapp.com/reset-password/${token}`, // Construct the reset link
      // ... any other parameters your template needs
    };

    // Send the email using EmailJS
    emailjs.send('service_ticketsupport', 'template_xjvdx3w', templateParams, 'EUBnlj0hhR2k1H8BA')
      .then((response) => {
        console.log('Email sent successfully', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email:', error);
      });
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='password'>New Password</label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='confirmPassword'>Confirm New Password</label>
          <input
            type='password'
            className='form-control'
            id='confirmPassword'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-block'>
            Reset Password
          </button>
        </div>
      </form>
    </section>
  );
}

export default ResetPassword;