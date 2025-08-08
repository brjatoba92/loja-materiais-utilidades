import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrderById(id);
      setOrder(res?.pedido || null);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="container-custom py-8">Pedido não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido #{order.id}</h1>
          <p className="text-gray-600">Cliente: {order.usuario_nome || order.usuario_email || `Usuário #${order.usuario_id}`}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Itens</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {(order.itens || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.produto_nome}</p>
                      <p className="text-sm text-gray-600">Qtd: {item.quantidade} x {formatCurrency(item.preco_unitario)}</p>
                    </div>
                    <div className="font-semibold">{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Resumo</h2>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex justify-between"><span>Total</span><span className="font-bold">{formatCurrency(order.total)}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="font-medium">{order.status}</span></div>
              <div className="flex justify-between"><span>Criado em</span><span>{new Date(order.created_at).toLocaleString('pt-BR')}</span></div>
              <div className="flex justify-between"><span>Pontos usados</span><span>{order.pontos_utilizados}</span></div>
              <div className="flex justify-between"><span>Pontos gerados</span><span>{order.pontos_gerados}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <Link to="/admin/pedidos" className="text-primary-600 hover:text-primary-700">Voltar para pedidos</Link>
          <button
            onClick={async () => {
              if (!window.confirm(`Confirmar exclusão do pedido #${order.id}?`)) return;
              try {
                await orderService.deleteOrder(order.id);
                toast.success('Pedido deletado com sucesso');
                window.location.href = '/admin/pedidos';
              } catch (e) {
                console.error(e);
                toast.error('Erro ao deletar pedido');
              }
            }}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Excluir pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;


