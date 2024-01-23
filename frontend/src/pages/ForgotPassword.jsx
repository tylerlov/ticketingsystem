import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/auth/authSlice'; // Import the action creator

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Dispatching forgotPassword with email:', email); // Added console.log for debugging
    dispatch(forgotPassword({ email })); // Dispatch the action with the email object
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-block'>
            Send Reset Link
          </button>
        </div>
      </form>
    </section>
  );
}

export default ForgotPassword;