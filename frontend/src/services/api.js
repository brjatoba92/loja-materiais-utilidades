import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intereptor para requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Interceptor para responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response ?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login'; // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);

export default api;