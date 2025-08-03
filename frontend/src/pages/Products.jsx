import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, ShoppingCart, Eye, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busca') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('preco_min') || '',
    max: searchParams.get('preco_max') || ''
  });
  const [sortBy, setSortBy] = useState(searchParams.get('ordenar') || 'nome');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const categories = [
    'Todos',
    'Cozinha',
    'Limpeza',
    'Organização',
    'Jardim',
    'Banheiro',
    'Sala',
    'Quarto'
  ];

  const sortOptions = [
    { value: 'nome', label: 'Nome A-Z' },
    { value: 'nome_desc', label: 'Nome Z-A' },
    { value: 'preco', label: 'Menor Preço' },
    { value: 'preco_desc', label: 'Maior Preço' },
    { value: 'avaliacao', label: 'Melhor Avaliado' },
    { value: 'recentes', label: 'Mais Recentes' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, selectedCategory, priceRange, sortBy, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        busca: debouncedSearchTerm,
        categoria: selectedCategory !== 'Todos' ? selectedCategory : '',
        preco_min: priceRange.min,
        preco_max: priceRange.max,
        ordenar: sortBy
      };

      const response = await getProducts(params);
      setProducts(response.produtos || response);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('busca', searchTerm);
    if (selectedCategory && selectedCategory !== 'Todos') params.set('categoria', selectedCategory);
    if (priceRange.min) params.set('preco_min', priceRange.min);
    if (priceRange.max) params.set('preco_max', priceRange.max);
    if (sortBy) params.set('ordenar', sortBy);
    if (currentPage > 1) params.set('pagina', currentPage);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('nome');
    setCurrentPage(1);
    setSearchParams({});
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.imagem || '/placeholder-product.jpg'}
          alt={product.nome}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {product.desconto > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.desconto}%
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => addToCart(product)}
            className="bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors"
            disabled={product.estoque === 0}
            title="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.nome}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < product.avaliacao ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.numero_avaliacoes})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.preco_original > product.preco && (
              <span className="text-sm text-gray-500 line-through">
                R$ {product.preco_original.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary-600">
              R$ {product.preco.toFixed(2)}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {product.estoque} em estoque
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = `/produto/${product.id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produtos</h1>
          <p className="text-gray-600">
            Encontre tudo que você precisa para sua casa
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Busca */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Filtros avançados */}
            <div className="grid md:grid-cols-4 gap-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Preço máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço máximo
                </label>
                <input
                  type="number"
                  placeholder="R$ 999,99"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Limpar filtros
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Visualização:</span>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Resultados */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {products.length} produto(s) encontrado(s)
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
