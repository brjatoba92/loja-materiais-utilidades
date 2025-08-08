import api from './api';

export const getDashboardStats = async (params = {}) => {
  const response = await api.get('/stats/dashboard', { params });
  return response.data;
};

export const getMonthlyRevenue = async () => {
  const response = await api.get('/stats/revenue-monthly');
  return response.data;
};

export const statsService = { getDashboardStats, getMonthlyRevenue };


