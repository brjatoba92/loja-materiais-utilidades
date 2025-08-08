import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct, getDistinctCategories } from '../services/productService';
import toast from 'react-hot-toast';

const AdminProductNew = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    estoque: 0,
    imagem_url: '',
    ativo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      };
      await createProduct(payload);
      toast.success('Produto criado com sucesso');
      navigate('/admin/produtos');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao criar produto';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getDistinctCategories();
        setCategories(res?.categorias || []);
      } catch (e) {
        // silencioso
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
          <Link to="/admin/produtos" className="text-primary-600 hover:text-primary-700">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              {!useCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    required
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setUseCustomCategory(true)} className="px-3 py-2 border rounded-lg">Nova</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input name="categoria" value={form.categoria} onChange={handleChange} required className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" placeholder="Digite a nova categoria" />
                  <button type="button" onClick={() => setUseCustomCategory(false)} className="px-3 py-2 border rounded-lg">Voltar</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
              <input name="preco" type="number" step="0.01" min="0" value={form.preco} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
              <input name="estoque" type="number" min="0" value={form.estoque} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem URL</label>
              <input name="imagem_url" value={form.imagem_url} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
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
              {submitting ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductNew;


