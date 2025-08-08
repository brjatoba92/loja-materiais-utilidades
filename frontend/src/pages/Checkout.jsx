import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, Truck, MapPin, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

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
    return subtotal >= 50 ? 0 : 10;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? subtotal * 0.1 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() - calculateDiscount();
  };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Montar payload para API
      const itensPayload = items.map((it) => ({
        produto_id: it.id,
        quantidade: it.quantidade,
      }));

      const payload = {
        itens: itensPayload,
        pontos_utilizados: 0,
        cliente: {
          nome: data.name,
          email: data.email,
          telefone: data.phone,
        },
      };

      const res = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Falha ao criar pedido');
      }

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate('/admin');
      
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'pix', label: 'PIX', icon: CreditCard },
    { id: 'boleto', label: 'Boleto Bancário', icon: CreditCard }
  ];

  const steps = [
    { id: 1, label: 'Dados Pessoais', icon: User },
    { id: 2, label: 'Endereço de Entrega', icon: MapPin },
    { id: 3, label: 'Pagamento', icon: CreditCard },
    { id: 4, label: 'Confirmação', icon: CheckCircle }
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carrinho vazio</h2>
          <p className="text-gray-600 mb-4">Adicione produtos ao carrinho para continuar.</p>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Ver Produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">
            Complete seus dados para finalizar o pedido
          </p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Dados Pessoais */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Pessoais
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Nome é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <span className="text-red-600 text-sm">{errors.name.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'E-mail é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'E-mail inválido'
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <span className="text-red-600 text-sm">{errors.email.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Telefone é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.phone && (
                      <span className="text-red-600 text-sm">{errors.phone.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      {...register('cpf', { required: 'CPF é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.cpf && (
                      <span className="text-red-600 text-sm">{errors.cpf.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      type="text"
                      {...register('street', { required: 'Rua é obrigatória' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.street && (
                      <span className="text-red-600 text-sm">{errors.street.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      {...register('number', { required: 'Número é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.number && (
                      <span className="text-red-600 text-sm">{errors.number.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      {...register('complement')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      {...register('neighborhood', { required: 'Bairro é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.neighborhood && (
                      <span className="text-red-600 text-sm">{errors.neighborhood.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'Cidade é obrigatória' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.city && (
                      <span className="text-red-600 text-sm">{errors.city.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      {...register('state', { required: 'Estado é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    {errors.state && (
                      <span className="text-red-600 text-sm">{errors.state.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      {...register('zipCode', { required: 'CEP é obrigatório' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.zipCode && (
                      <span className="text-red-600 text-sm">{errors.zipCode.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Forma de Pagamento
                </h2>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <method.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'credit' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        {...register('cardNumber', { required: 'Número do cartão é obrigatório' })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0000 0000 0000 0000"
                      />
                      {errors.cardNumber && (
                        <span className="text-red-600 text-sm">{errors.cardNumber.message}</span>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome no Cartão *
                        </label>
                        <input
                          type="text"
                          {...register('cardName', { required: 'Nome no cartão é obrigatório' })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {errors.cardName && (
                          <span className="text-red-600 text-sm">{errors.cardName.message}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Validade *
                        </label>
                        <input
                          type="text"
                          {...register('cardExpiry', { required: 'Data de validade é obrigatória' })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="MM/AA"
                        />
                        {errors.cardExpiry && (
                          <span className="text-red-600 text-sm">{errors.cardExpiry.message}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          {...register('cardCvv', { required: 'CVV é obrigatório' })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="123"
                        />
                        {errors.cardCvv && (
                          <span className="text-red-600 text-sm">{errors.cardCvv.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Finalizar */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Finalizar Compra
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Resumo do Pedido</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Itens */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.nome}</p>
                        <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                      </div>
                      <span className="font-medium">{formatPrice(item.preco * item.quantidade)}</span>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className={calculateShipping() === 0 ? 'text-green-600' : ''}>
                      {calculateShipping() === 0 ? 'Grátis' : formatPrice(calculateShipping())}
                    </span>
                  </div>
                  
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Informações de Segurança */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Pagamento seguro com criptografia SSL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 