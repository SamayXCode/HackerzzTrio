import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { currentUser, logout } = useAuth()
  
  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
  }
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-semibold">StackIt</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <div className="relative">
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-700" />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar