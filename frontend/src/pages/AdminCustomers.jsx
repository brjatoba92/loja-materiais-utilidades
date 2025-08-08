import React, { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { userService } from '../services/userService';

const AdminCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('pontos_desc');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [search, sort, page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await userService.list({ page, limit: 20, busca: search, sort });
      setCustomers(res?.usuarios || []);
      setPages(res?.pagination?.pages || 1);
      setTotal(res?.pagination?.total || 0);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
              <p className="text-gray-600">Lista de clientes com pontuação de cashback</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nome ou e-mail"
                  value={search}
                  onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={sort}
                onChange={(e) => { setPage(1); setSort(e.target.value); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pontos_desc">Mais pontos</option>
                <option value="pontos_asc">Menos pontos</option>
                <option value="nome_asc">Nome A-Z</option>
                <option value="nome_desc">Nome Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" /> Clientes ({customers.length})
              </h2>
              <div className="text-sm text-gray-600">Total: {total}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.telefone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-700">{u.pontos_cashback}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(u.created_at).toISOString().slice(0,10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">Mostrando {(page - 1) * 20 + 1} a {Math.min(page * 20, total)} de {total}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">Anterior</button>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-2 rounded-lg ${page === i + 1 ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page === pages} className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">Próximo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;


