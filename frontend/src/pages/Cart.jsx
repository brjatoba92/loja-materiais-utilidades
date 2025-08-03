import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotal, 
    getItemsCount,
    getCashbackPoints,
    clearCart 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 10; // Frete grátis acima de R$ 50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">
              Adicione alguns produtos para começar suas compras
            </p>
            <Link
              to="/produtos"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
          <p className="text-gray-600">
            {getItemsCount()} item(s) no carrinho
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Itens do Carrinho</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Imagem */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imagem || '/placeholder-product.jpg'}
                          alt={item.nome}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.nome}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Categoria: {item.categoria}
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-bold text-primary-600">
                                {formatPrice(item.preco)}
                              </span>
                              {item.preco_original > item.preco && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.preco_original)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Controles de Quantidade */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantidade - 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">
                              {item.quantidade}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantidade + 1)}
                              disabled={item.quantidade >= item.estoque}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal do Item */}
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-gray-600">
                            Subtotal: {formatPrice(item.preco * item.quantidade)}
                          </span>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 flex items-center text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remover
                          </button>
                        </div>

                        {/* Estoque */}
                        <div className="mt-2">
                          <span className={`text-sm ${
                            item.estoque > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.estoque > 0 ? `${item.estoque} unidades em estoque` : 'Fora de estoque'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações do Carrinho */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Limpar Carrinho
                  </button>
                  
                  <Link
                    to="/produtos"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Resumo do Pedido</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getItemsCount()} itens)</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>

                {/* Frete */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      formatPrice(calculateShipping())
                    )}
                  </span>
                </div>

                {/* Desconto (se houver) */}
                {calculateSubtotal() >= 100 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto (10% acima de R$ 100)</span>
                    <span>-{formatPrice(calculateSubtotal() * 0.1)}</span>
                  </div>
                )}

                {/* Linha divisória */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                {/* Cashback */}
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-700">
                      Você ganha {getCashbackPoints(calculateTotal())} pontos
                    </span>
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                </div>

                {/* Botão de Checkout */}
                <Link
                  to="/checkout"
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  Finalizar Compra
                </Link>

                {/* Informações adicionais */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Entrega grátis em pedidos acima de R$ 50,00</p>
                  <p>• 30 dias de garantia</p>
                  <p>• Pagamento seguro</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Recomendados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Aqui você pode adicionar produtos recomendados baseados nos itens do carrinho */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Produtos recomendados aparecerão aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
