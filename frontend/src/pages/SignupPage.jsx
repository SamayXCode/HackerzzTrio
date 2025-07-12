import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    agreeTerms: false
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.agreeTerms) {
      return setError('You must agree to the Terms of Service and Privacy Policy')
    }
    
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      })
      navigate('/login')
    } catch (err) {
      setError('Failed to create an account. Please try again.')
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
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up for StackIt</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="given-name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agreeTerms"
              type="checkbox"
              required
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage