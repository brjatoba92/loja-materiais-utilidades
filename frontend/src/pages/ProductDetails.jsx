import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getProductById, getProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productResponse = await getProductById(id);
      const productData = productResponse?.produto || productResponse || null;
      setProduct(productData);
      
      // Buscar produtos relacionados
      if (productData?.categoria) {
        const related = await getProducts({ 
          categoria: productData.categoria, 
          limit: 4,
          exclude: id 
        });
        setRelatedProducts(related?.produtos || related || []);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.estoque) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Produto não encontrado</h2>
          <p className="text-gray-600 mb-4">O produto que você está procurando não existe ou foi removido.</p>
          <Link
            to="/produtos"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos produtos
          </Link>
        </div>
      </div>
    );
  }

  const images = (product.imagens && product.imagens.length > 0)
    ? product.imagens
    : [product.imagem_url || product.imagem].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/produtos" className="hover:text-primary-600">Produtos</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={`/produtos?categoria=${product.categoria?.toLowerCase()}`} className="hover:text-primary-600">
                {product.categoria}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.nome}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div>
            <div className="mb-4">
              <img
                src={images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.nome}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.nome} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.nome}</h1>
            
            {/* Avaliação */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars(product.avaliacao || 0)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.numero_avaliacoes || 0} avaliações)
              </span>
            </div>

            {/* Preço */}
            <div className="mb-6">
              {Number(product.preco_original) > Number(product.preco) && (
                <div className="text-sm text-gray-500 line-through mb-1">
                  {formatPrice(Number(product.preco_original))}
                </div>
              )}
              <div className="text-3xl font-bold text-primary-600">
                {formatPrice(Number(product.preco))}
              </div>
              {product.desconto > 0 && (
                <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded ml-2">
                  -{product.desconto}% OFF
                </span>
              )}
            </div>

            {/* Estoque */}
            <div className="mb-6">
              <span className={`text-sm font-medium ${
                Number(product.estoque) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Number(product.estoque) > 0 ? `${product.estoque} unidades em estoque` : 'Fora de estoque'}
              </span>
            </div>

            {/* Quantidade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.estoque}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border border-gray-300 rounded py-1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.estoque}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.estoque === 0}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Informações de Entrega */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-5 h-5 mr-3" />
                  <span>Entrega grátis em pedidos acima de R$ 50,00</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-5 h-5 mr-3" />
                  <span>30 dias de garantia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Informações */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Descrição' },
                { id: 'specifications', label: 'Especificações' },
                { id: 'reviews', label: 'Avaliações' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.descricao}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informações Gerais</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Categoria:</dt>
                      <dd className="font-medium">{product.categoria}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Marca:</dt>
                      <dd className="font-medium">{product.marca || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Modelo:</dt>
                      <dd className="font-medium">{product.modelo || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium">{product.sku || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Dimensões</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Peso:</dt>
                      <dd className="font-medium">{product.peso || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Altura:</dt>
                      <dd className="font-medium">{product.altura || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Largura:</dt>
                      <dd className="font-medium">{product.largura || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Profundidade:</dt>
                      <dd className="font-medium">{product.profundidade || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Avaliações dos Clientes</h4>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
                    Escrever Avaliação
                  </button>
                </div>
                
                {product.avaliacoes && product.avaliacoes.length > 0 ? (
                  <div className="space-y-4">
                    {product.avaliacoes.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">{review.author}</span>
                          <span className="text-sm text-gray-400 ml-2">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/produto/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.imagem || '/placeholder-product.jpg'}
                      alt={relatedProduct.nome}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {relatedProduct.desconto > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{relatedProduct.desconto}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.nome}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(relatedProduct.preco)}
                      </span>
                      <div className="flex text-yellow-400">
                        {renderStars(relatedProduct.avaliacao || 0)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
