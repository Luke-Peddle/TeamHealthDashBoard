import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../utils/axiosConfig'; 

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            initializeAuth();
        }
    }, [isClient]);

    const clearAuthData = () => {
        setAccessToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo');
        }
    };

    const initializeAuth = async () => {
        try {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem('accessToken');
                const storedUser = localStorage.getItem('userInfo');

                if (storedToken && storedUser) {
                    setAccessToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    try {
                        const response = await api.post('/refresh');
                        const { accessToken, user } = response.data;

                        if (typeof window !== 'undefined') {
                            localStorage.setItem('accessToken', accessToken);
                            localStorage.setItem('userInfo', JSON.stringify(user));
                        }
                        setAccessToken(accessToken);
                        setUser(user);
                    } catch (error) {
                        console.log('No valid refresh token available');
                        clearAuthData();
                    }
                }
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            clearAuthData();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            clearAuthData();

            const response = await api.post('/login', { username, password });
            
            const { accessToken, user } = response.data;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('userInfo', JSON.stringify(user));
            }
            setAccessToken(accessToken);
            setUser(user);
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Login failed:', error);
            clearAuthData();
            
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            // Call backend logout to clear cookies
            await api.post('/logout');
            console.log('Backend logout successful');
        } catch (error) {
            console.error('Backend logout error:', error);
        }
        
        clearAuthData();
        
        if (typeof document !== 'undefined') {
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        
        console.log('Frontend logout completed');
    };

    const refreshToken = async () => {
        try {
            const response = await api.post('/refresh');
            const { accessToken, user } = response.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('userInfo', JSON.stringify(user));
            }
            setAccessToken(accessToken);
            setUser(user);

            return accessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthData();
            throw error;
        }
    };

    const isAuthenticated = () => {
        return !!(accessToken && user);
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        accessToken,
        loading,
        login,
        logout,
        refreshToken,
        isAuthenticated,
        hasRole,
        clearAuthData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};