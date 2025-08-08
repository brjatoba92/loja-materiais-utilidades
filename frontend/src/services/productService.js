import api from './api';

// Funções principais que estão sendo usadas no código
export const getProducts = async (params = {}) => {
    try {
        const response = await api.get('/produtos', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/produtos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
};

export const getDistinctCategories = async () => {
  try {
    const response = await api.get('/produtos/categorias/distinct');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

export const createProduct = async (product) => {
    try {
        const response = await api.post('/produtos', product);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }
};

export const updateProduct = async (id, product) => {
    try {
        const response = await api.put(`/produtos/${id}`, product);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/produtos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
};

export const getLowStockProducts = async (params = {}) => {
  try {
    const response = await api.get('/produtos/low-stock', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos com baixo estoque:', error);
    throw error;
  }
};

// Serviço completo para compatibilidade
export const productService = {
    // Listar produtos
    getAll: async (params = {}) => {
        const response = await api.get('/produtos', { params });
        return response.data;
    },
    // Buscar produto por ID
    getById: async (id) => {
        const response = await api.get(`/produtos/${id}`);
        return response.data;
    },
    // Criar produto
    create: async (product) => {
        const response = await api.post('/produtos', product);
        return response.data;
    },
    // Atualizar produto
    update: async (id, product) => {
        const response = await api.put(`/produtos/${id}`, product);
        return response.data;
    },
    // Deletar produto
    delete: async (id) => {
        const response = await api.delete(`/produtos/${id}`);
        return response.data;
    },
    getDistinctCategories: async () => {
        const res = await api.get('/produtos/categorias/distinct');
        return res.data;
    },
    getLowStock: async (params = {}) => {
      const res = await api.get('/produtos/low-stock', { params });
      return res.data;
    }
};