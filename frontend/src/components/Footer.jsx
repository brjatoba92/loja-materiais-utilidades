import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Produtos': [
      { name: 'Cozinha', href: '/produtos?categoria=cozinha' },
      { name: 'Limpeza', href: '/produtos?categoria=limpeza' },
      { name: 'Organização', href: '/produtos?categoria=organizacao' },
      { name: 'Jardim', href: '/produtos?categoria=jardim' },
      { name: 'Banheiro', href: '/produtos?categoria=banheiro' }
    ],
    'Ajuda': [
      { name: 'Como Comprar', href: '/ajuda/como-comprar' },
      { name: 'Política de Entrega', href: '/ajuda/entrega' },
      { name: 'Política de Devolução', href: '/ajuda/devolucao' },
      { name: 'Trocas e Garantias', href: '/ajuda/garantias' },
      { name: 'FAQ', href: '/ajuda/faq' }
    ],
    'Empresa': [
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Nossa História', href: '/sobre/historia' },
      { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Casa & Lar</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Sua loja de confiança para produtos de casa e utilidades. 
              Oferecemos qualidade, preços justos e o melhor atendimento 
              para tornar sua casa ainda mais especial.
            </p>
            
            {/* Contato */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                <span>contato@casaelar.com.br</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3" />
                <span>Rua das Flores, 123 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Links Úteis */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Redes Sociais e Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Redes Sociais */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-gray-300">Siga-nos:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Receba ofertas exclusivas:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors">
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Casa & Lar. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <img src="/payment-methods/visa.png" alt="Visa" className="h-8" />
              <img src="/payment-methods/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="/payment-methods/pix.png" alt="PIX" className="h-8" />
              <img src="/payment-methods/boleto.png" alt="Boleto" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;







