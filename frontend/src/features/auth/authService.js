import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => localStorage.removeItem('user')

// Forgot Password
const forgotPassword = async (email) => {
  console.log('forgotPassword function called with email:', email);
  const response = await axios.post(API_URL + 'forgot-password', { email })
  return response.data
}

// Reset Password
const resetPassword = async (data) => {
  const response = await axios.put(API_URL + 'reset-password/' + data.token, { password: data.password })
  return response.data
}

const authService = {
  register,
  logout,
  login,
  forgotPassword,
  resetPassword,
}

export default authService
