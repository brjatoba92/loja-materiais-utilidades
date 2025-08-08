import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'processando', label: 'Processando' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

const getStatusPill = (status) => {
  switch (status) {
    case 'pendente':
      return 'bg-gray-100 text-gray-800';
    case 'confirmado':
      return 'bg-blue-100 text-blue-800';
    case 'processando':
      return 'bg-yellow-100 text-yellow-800';
    case 'enviado':
      return 'bg-indigo-100 text-indigo-800';
    case 'entregue':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders({ status, page, limit: 10 });
      setOrders(res?.pedidos || []);
      setPages(res?.pagination?.pages || 1);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Confirmar exclusão do pedido #${id}?`)) return;
    try {
      await orderService.deleteOrder(id);
      toast.success('Pedido deletado com sucesso');
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error('Erro ao deletar pedido');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h1>
          <p className="text-gray-600">Gerencie os pedidos da sua loja</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{o.usuario_nome || o.usuario_email || `Usuário #${o.usuario_id}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(o.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(o.created_at).toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-3">
                      <Link
                        to={`/admin/pedidos/${o.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ver detalhes
                      </Link>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >Anterior</button>
              <div className="space-x-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                  >{p}</button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >Próximo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;


