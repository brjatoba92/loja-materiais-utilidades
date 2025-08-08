import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productService';
import toast from 'react-hot-toast';

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoria: '', estoque: 0, imagem_url: '', ativo: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        const p = res?.produto || res;
        setForm({
          nome: p.nome || '',
          descricao: p.descricao || '',
          preco: p.preco || '',
          categoria: p.categoria || '',
          estoque: p.estoque || 0,
          imagem_url: p.imagem_url || '',
          ativo: p.ativo !== false,
        });
      } catch (e) {
        toast.error('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, preco: Number(form.preco), estoque: Number(form.estoque) };
      await updateProduct(id, payload);
      toast.success('Produto atualizado');
      navigate('/admin/produtos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container-custom py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
          <Link to="/admin/produtos" className="text-primary-600 hover:text-primary-700">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <input name="categoria" value={form.categoria} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
              <input name="preco" type="number" step="0.01" min="0" value={form.preco} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
              <input name="estoque" type="number" min="0" value={form.estoque} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem URL</label>
              <input name="imagem_url" value={form.imagem_url} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="inline-flex items-center space-x-2">
                <input name="ativo" type="checkbox" checked={form.ativo} onChange={handleChange} />
                <span className="text-sm text-gray-700">Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;


