import api from './api';

export const getOrders = async (params = {}) => {
  const response = await api.get('/pedidos', { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/pedidos/${id}`);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/pedidos/${id}`);
  return response.data;
};

export const orderService = { getOrders, getOrderById, deleteOrder };


