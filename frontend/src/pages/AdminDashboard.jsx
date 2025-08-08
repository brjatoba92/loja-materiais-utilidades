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
import { orderService } from '../services/orderService';
import { statsService } from '../services/statsService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    revenueChart: [],
    deltas: {
      ordersPct: null,
      revenuePct: null,
      customersPct: null,
    },
    absolutes: {
      ordersNow: 0,
      ordersPrev: null,
      revenueNow: 0,
      revenuePrev: null,
      customersNow: 0,
      customersPrev: null,
    }
  });
  const [period, setPeriod] = useState(''); // '', '30d', '90d'

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Monta filtros por período para stats (apenas stats usa período)
      const now = new Date();
      let currentParams = {};
      let previousParams = null;
      if (period === '30d' || period === '90d') {
        const days = period === '30d' ? 30 : 90;
        const end = new Date(now);
        const start = new Date(now);
        start.setDate(end.getDate() - days);
        currentParams = { startDate: start.toISOString(), endDate: end.toISOString() };

        const prevEnd = new Date(start);
        const prevStart = new Date(start);
        prevStart.setDate(prevEnd.getDate() - days);
        previousParams = { startDate: prevStart.toISOString(), endDate: prevEnd.toISOString() };
      }

      const [ordersRes, statsRes, revenueRes, prevStatsRes] = await Promise.all([
        orderService.getOrders({ page: 1, limit: 5 }),
        statsService.getDashboardStats(currentParams),
        statsService.getMonthlyRevenue(),
        previousParams ? statsService.getDashboardStats(previousParams) : Promise.resolve({ data: null })
      ]);
      const pedidos = ordersRes?.pedidos || [];
      const s = statsRes?.data || {};
      const ps = prevStatsRes?.data || null;

      const computePct = (curr, prev) => {
        if (prev == null) return null; // sem período selecionado
        const c = Number(curr) || 0;
        const p = Number(prev) || 0;
        if (p === 0) return c === 0 ? 0 : 100;
        return ((c - p) / p) * 100;
      };

      setStats((prev) => ({
        ...prev,
        totalProducts: s.totalProducts ?? prev.totalProducts,
        totalCustomers: s.totalCustomers ?? prev.totalCustomers,
        totalRevenue: Number(s.totalRevenue) || prev.totalRevenue,
        totalOrders: (s.totalOrders ?? ordersRes?.pagination?.total ?? pedidos.length),
        recentOrders: pedidos.map((p) => ({
          id: p.id,
          customer: p.usuario_nome || p.usuario_email || `Usuário #${p.usuario_id}`,
          total: Number(p.total) || 0,
          status: p.status || 'confirmado',
          date: new Date(p.created_at).toISOString().slice(0, 10),
        })),
        revenueChart: (revenueRes?.data || []).map((r) => ({
          month: r.month_label,
          revenue: Number(r.revenue) || 0,
        })),
        deltas: {
          ordersPct: computePct(s.totalOrders, ps?.totalOrders),
          revenuePct: computePct(s.totalRevenue, ps?.totalRevenue),
          customersPct: computePct(s.totalCustomers, ps?.totalCustomers),
        },
        absolutes: {
          ordersNow: s.totalOrders ?? 0,
          ordersPrev: ps?.totalOrders ?? null,
          revenueNow: Number(s.totalRevenue) || 0,
          revenuePrev: ps ? (Number(ps.totalRevenue) || 0) : null,
          customersNow: s.totalCustomers ?? 0,
          customersPrev: ps?.totalCustomers ?? null,
        }
      }));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh: atualizar pedidos recentes a cada 15s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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

  const maxRevenue = Math.max(1, ...stats.revenueChart.map((i) => i.revenue || 0));

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

        {/* Filtro de Período e Cards de Estatísticas */}
        <div className="flex justify-end mb-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            title="Período para clientes/receita/pedidos"
          >
            <option value="">Tudo</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
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
            {stats.deltas.ordersPct !== null && (
              <div className="mt-4 flex items-center text-sm" title={`Atual: ${stats.absolutes.ordersNow} • Anterior: ${stats.absolutes.ordersPrev ?? '-'} `}>
                {stats.deltas.ordersPct >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={stats.deltas.ordersPct >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {`${Math.abs(stats.deltas.ordersPct).toFixed(1)}%`}
                </span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </div>
            )}
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
            {stats.deltas.revenuePct !== null && (
              <div className="mt-4 flex items-center text-sm" title={`Atual: ${formatCurrency(stats.absolutes.revenueNow)} • Anterior: ${stats.absolutes.revenuePrev !== null ? formatCurrency(stats.absolutes.revenuePrev) : '-'}`}>
                {stats.deltas.revenuePct >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={stats.deltas.revenuePct >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {`${Math.abs(stats.deltas.revenuePct).toFixed(1)}%`}
                </span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </div>
            )}
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
            {stats.deltas.customersPct !== null && (
              <div className="mt-4 flex items-center text-sm" title={`Atual: ${stats.absolutes.customersNow} • Anterior: ${stats.absolutes.customersPrev ?? '-'}`}>
                {stats.deltas.customersPct >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={stats.deltas.customersPct >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {`${Math.abs(stats.deltas.customersPct).toFixed(1)}%`}
                </span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </div>
            )}
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
                  <div key={index} className="flex flex-col items-center" title={formatCurrency(item.revenue)}>
                    <span className="text-xs text-gray-700 mb-1">{formatCurrency(item.revenue)}</span>
                    <div
                      className="w-8 bg-gradient-to-t from-primary-500 to-primary-600 rounded-t shadow-sm"
                      style={{ height: `${Math.max(4, Math.round((item.revenue / maxRevenue) * 200))}px` }}
                    />
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
