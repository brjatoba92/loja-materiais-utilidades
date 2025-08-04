import { get } from 'react-hook-form';
import api from './api';

// Função de login do admin que está sendo usada no código
export const loginAdmin = async (credentials) => {
    try {
        console.log('🔐 Tentando login com:', credentials);
        const response = await api.post('/auth/login', credentials);
        console.log('✅ Resposta do servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro no login:', error);
        console.error('❌ Status:', error.response?.status);
        console.error('❌ Data:', error.response?.data);
        throw error;
    }
};

export const userService = {
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
        const response = await api.get(`/users/${userId}/points`);
        return response.data;
    },

    // Historico de pedidos
    getOrders: async (id, params = {}) => {
        const response = await api.get(`/usuarios/${id}/pedidos`, { params })
        return response.data
    }
};