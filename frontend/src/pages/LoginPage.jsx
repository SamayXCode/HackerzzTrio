import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { sendOTP, verifyOTPAndLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await sendOTP(email)
      setOtpSent(true)
    } catch (err) {
      setError('Failed to send OTP. Please check your email and try again.')
      console.error(err)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifyOTPAndLogin(email, otp)
      navigate('/')
    } catch (err) {
      setError('Failed to verify OTP. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-semibold">StackIt</span>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to StackIt</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!otpSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send OTP
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage