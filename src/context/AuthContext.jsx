import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ...

    const sendOtp = async (email, name) => {
        try {
            await axios.post('/auth/send-otp', { email, name });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
    };

    const login = async (email, password, otp = null) => {
        try {
            const response = await axios.post('/auth/login', { email, password, otp });
            const data = response.data;

            if (data.requiresOtp) {
                return { success: true, requiresOtp: true };
            }

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true, requiresOtp: false };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, mobile, otp) => {
        try {
            const response = await axios.post('/auth/register', { name, email, password, mobile, otp });
            const data = response.data;
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('/auth/forgot-password', { email });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to send reset link' };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await axios.post('/auth/verify-otp', { email, otp });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to verify OTP' };
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const response = await axios.post('/auth/reset-password', { email, otp, newPassword });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, sendOtp, forgotPassword, verifyOtp, resetPassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
