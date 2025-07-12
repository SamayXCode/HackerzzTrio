import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
    });

    instance.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });
    return instance;
  }, []);

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    if (user && accessToken) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const sendOTP = async (email) => {
    return await axiosInstance.post('/send-otp/', { email });
  };

  const verifyOTPAndLogin = async (email, otp) => {
    const response = await axiosInstance.post('/verify-otp/', { email, otp });
    const { access, refresh, user } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const signup = async (userData) => {
    return await axiosInstance.post('/register/', userData);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await axiosInstance.post('/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Failed to blacklist token', error);
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    sendOTP,
    verifyOTPAndLogin,
    signup,
    logout,
    axiosInstance,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};