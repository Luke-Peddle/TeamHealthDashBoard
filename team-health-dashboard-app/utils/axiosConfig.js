import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const clearAuthData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
    }
};

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && 
            !originalRequest._retry) {

            // Don't try to refresh on auth endpoints
            if (originalRequest.url?.includes('/login') || 
                originalRequest.url?.includes('/logout') ||
                originalRequest.url?.includes('/refresh')) {
                clearAuthData();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }
                    return Promise.reject(error);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('Attempting token refresh...');
                
                // Use the correct refresh endpoint
                const response = await axios.post('http://localhost:4000/api/login/refresh', {}, {
                    withCredentials: true
                });

                console.log('Token refresh successful');
                
                const { accessToken } = response.data;
                
                if (!accessToken) {
                    throw new Error('No access token received from refresh');
                }
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    if (response.data.user) {
                        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                    }
                }

                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                
                processQueue(refreshError, null);
                clearAuthData();

                if (typeof window !== 'undefined' && 
                    !window.location.pathname.includes('/login')) {
                    console.log('Redirecting to login due to refresh failure');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 100);
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;