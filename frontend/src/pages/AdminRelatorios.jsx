import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { statsService } from '../services/statsService';

const AdminRelatorios = () => {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // [{ month_label, revenue }]
  const [error, setError] = useState('');

  const hasValidRange = useMemo(() => {
    return Boolean(startDate) && Boolean(endDate) && new Date(startDate) <= new Date(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    // Carrega dados iniciais (sem filtro) e gráfico mensal
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value) || 0);
  };

  const fetchData = async (withRange = false) => {
    setLoading(true);
    setError('');
    try {
      const params = withRange && hasValidRange ? { startDate, endDate } : {};
      const [statsRes, revenueRes] = await Promise.all([
        statsService.getDashboardStats(params),
        statsService.getMonthlyRevenue(),
      ]);

      const s = statsRes?.data || {};
      setSummary({
        totalRevenue: Number(s.totalRevenue) || 0,
        totalOrders: s.totalOrders ?? 0,
        totalCustomers: s.totalCustomers ?? 0,
      });

      const rev = (revenueRes?.data || []).map((r) => ({
        month_label: r.month_label || r.month || '',
        revenue: Number(r.revenue) || 0,
      }));
      setMonthlyRevenue(rev);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      setError('Não foi possível carregar os dados de relatório.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchData(true);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchData(false);
  };

  const exportMonthlyCsv = () => {
    const header = ['Mes', 'Receita'];
    const rows = monthlyRevenue.map((r) => [r.month_label, String(r.revenue).replace('.', ',')]);
    const csv = [header, ...rows].map((cols) => cols.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receita_mensal.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxRevenue = useMemo(() => {
    return monthlyRevenue.reduce((acc, cur) => Math.max(acc, cur.revenue), 0) || 1;
  }, [monthlyRevenue]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
      </div>

      {/* Filtros */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data inicial</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data final</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-3 md:justify-end">
            <button
              onClick={handleApplyFilter}
              disabled={!hasValidRange}
              className={`px-4 py-2 rounded-md text-white ${hasValidRange ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'}`}
              title={!hasValidRange ? 'Selecione um intervalo válido' : 'Aplicar filtro'}
            >
              Aplicar filtro
            </button>
            <button
              onClick={handleClearFilter}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-3">{error}</p>
        )}
      </div>

      {/* Cards de resumo */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Receita no período</p>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Pedidos no período</p>
          <p className="text-2xl font-semibold text-gray-900">{summary.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Clientes no período</p>
          <p className="text-2xl font-semibold text-gray-900">{summary.totalCustomers}</p>
        </div>
      </div>

      {/* Gráfico simples de barras (12 meses) */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Receita Mensal (12 meses)</h2>
          <button
            onClick={exportMonthlyCsv}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Exportar CSV
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between h-64">
            {monthlyRevenue.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center" title={formatCurrency(item.revenue)}>
                <span className="text-xs text-gray-700 mb-1">{formatCurrency(item.revenue)}</span>
                <div
                  className="w-8 bg-gradient-to-t from-primary-500 to-primary-600 rounded-t shadow-sm"
                  style={{ height: `${Math.max(4, Math.round((item.revenue / maxRevenue) * 200))}px` }}
                />
                <span className="text-xs text-gray-600 mt-2">{item.month_label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRelatorios;


