import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, ShoppingCart, ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await getProducts({ limit: 8, featured: true });
        setFeaturedProducts(response?.produtos || response || []);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Cozinha', icon: Package, count: 150, color: 'bg-orange-100' },
    { name: 'Limpeza', icon: Package, count: 120, color: 'bg-blue-100' },
    { name: 'Organização', icon: Package, count: 80, color: 'bg-green-100' },
    { name: 'Jardim', icon: Package, count: 60, color: 'bg-purple-100' },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Entrega em até 24h para toda a região'
    },
    {
      icon: Shield,
      title: 'Garantia',
      description: '30 dias de garantia em todos os produtos'
    },
    {
      icon: CreditCard,
      title: 'Pagamento Seguro',
      description: 'Múltiplas formas de pagamento'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Casa & Lar
              </h1>
              <p className="text-xl mb-6 text-primary-100">
                Tudo para sua casa em um só lugar. Produtos de qualidade com os melhores preços.
              </p>
              <Link
                to="/produtos"
                className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Produtos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                <Package className="w-32 h-32 mx-auto text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/produtos?categoria=${encodeURIComponent(category.name)}`}
                className={`${category.color} p-6 rounded-lg text-center hover:shadow-lg transition-shadow`}
              >
                <category.icon className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} produtos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
            <Link
              to="/produtos"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              Ver todos
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.imagem_url || product.imagem || '/placeholder-product.jpg'}
                    alt={product.nome}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.desconto > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{product.desconto}%
                    </div>
                  )}
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
                          R$ {(Number(product.preco_original) || 0).toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary-600">
                        R$ {(Number(product.preco) || 0).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.estoque} em estoque
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/produto/${product.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-200 transition-colors"
                    >
                      Ver detalhes
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors"
                      disabled={product.estoque === 0}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a Casa & Lar?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
