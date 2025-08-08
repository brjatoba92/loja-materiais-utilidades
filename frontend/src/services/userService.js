import api from './api';

// Função de login do admin que está sendo usada no código
export const loginAdmin = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

export const userService = {
    // listar usuarios (admin)
    list: async (params = {}) => {
        const response = await api.get('/usuarios', { params });
        return response.data;
    },
    //criar usuario
    create: async (user) => {
        const response = await api.post('/users', user);
        return response.data;
    },
    //buscar usuario por ID
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    //consultar pontos
    getPoints: async (userId) => {
        const response = await api.get(`/usuarios/${userId}/pontos`);
        return response.data;
    },

    // Historico de pedidos
    getOrders: async (id, params = {}) => {
        const response = await api.get(`/usuarios/${id}/pedidos`, { params })
        return response.data
    }
};