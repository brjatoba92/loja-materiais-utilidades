import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Plus,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    revenueChart: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simular dados do dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProducts: 156,
        totalOrders: 89,
        totalRevenue: 15420.50,
        totalCustomers: 234,
        recentOrders: [
          {
            id: 1,
            customer: 'João Silva',
            total: 299.90,
            status: 'Entregue',
            date: '2024-01-15'
          },
          {
            id: 2,
            customer: 'Maria Santos',
            total: 159.80,
            status: 'Em Transporte',
            date: '2024-01-14'
          },
          {
            id: 3,
            customer: 'Pedro Costa',
            total: 89.90,
            status: 'Processando',
            date: '2024-01-14'
          },
          {
            id: 4,
            customer: 'Ana Oliveira',
            total: 199.90,
            status: 'Entregue',
            date: '2024-01-13'
          }
        ],
        topProducts: [
          {
            id: 1,
            name: 'Panela de Pressão',
            sales: 45,
            revenue: 2245.50
          },
          {
            id: 2,
            name: 'Jogo de Talheres',
            sales: 38,
            revenue: 1890.00
          },
          {
            id: 3,
            name: 'Liquidificador',
            sales: 32,
            revenue: 1596.00
          },
          {
            id: 4,
            name: 'Conjunto de Panelas',
            sales: 28,
            revenue: 1398.00
          }
        ],
        revenueChart: [
          { month: 'Jan', revenue: 12000 },
          { month: 'Fev', revenue: 15000 },
          { month: 'Mar', revenue: 18000 },
          { month: 'Abr', revenue: 14000 },
          { month: 'Mai', revenue: 16000 },
          { month: 'Jun', revenue: 19000 }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue':
        return 'bg-green-100 text-green-800';
      case 'Em Transporte':
        return 'bg-blue-100 text-blue-800';
      case 'Processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral da sua loja
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8%</span>
              <span className="text-gray-500 ml-1">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15%</span>
              <span className="text-gray-500 ml-1">vs mês passado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+5%</span>
              <span className="text-gray-500 ml-1">vs mês passado</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pedidos Recentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Pedidos Recentes</h2>
                  <Link
                    to="/admin/pedidos"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Produtos Mais Vendidos</h2>
                  <Link
                    to="/admin/produtos"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} vendas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Receita */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Receita Mensal</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-end justify-between h-64">
                {stats.revenueChart.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-primary-600 rounded-t"
                      style={{ 
                        height: `${(item.revenue / 20000) * 200}px` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/produtos/novo"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Adicionar Produto</p>
                  <p className="text-sm text-gray-600">Criar novo produto</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/produtos"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Edit className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Gerenciar Produtos</p>
                  <p className="text-sm text-gray-600">Editar produtos</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/pedidos"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Ver Pedidos</p>
                  <p className="text-sm text-gray-600">Gerenciar pedidos</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/relatorios"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Ver relatórios</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
