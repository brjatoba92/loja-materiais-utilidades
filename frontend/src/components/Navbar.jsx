import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Package, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { getItemsCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/produtos', label: 'Produtos', icon: Package }
    ];
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className='container-custom'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link to='/' className='flex items-center space-x-2'>
                        <div className='bg-primary-600 text-white p-2 rounded-lg'>
                            <Package className='w-6 h-6' />
                        </div>
                        <span className='text-xl font-bold text-gray-900'>
                            Casa & Lar
                        </span>
                    </Link>
                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-8'>
                        {navLinks.map(({path, label, icon: Icon}) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 text-gray-700 hover:text-primary-600 ${
                                    isActive(path) 
                                        ? 'text-primary-600 bg-primary-50' 
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className='w-4 h-4' />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {/* Cart */}
                        <Link 
                            to='/carrinho' 
                            className='relative p-2 text-gray-700 hover:text-primary-600 transition-colors'
                        >
                            <ShoppingCart className='w-6 h-6' />
                            {getItemsCount() > 0 && (
                                <span className='absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                    {getItemsCount()}
                                </span>
                            )}
                        </Link>

                        {/* Admin */}
                        <Link 
                            to='/admin/login' 
                            className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors" 
                        >
                            <User className='w-4 h-4' />
                            <span>Admin</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='p-2 text-gray-700 hover:text-primary-600 transition-colors'
                        >
                            {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                        </button>
                    </div>
                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className='md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg'>
                            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                                {navLinks.map(({path, label, icon: Icon}) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                            isActive(path) 
                                                ? 'text-primary-600 bg-primary-50' 
                                                : 'text-gray-700 hover:text-primary-50 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className='w-5 h-5' />
                                        <span>{label}</span>
                                    </Link>
                                ))}

                                <Link
                                    to='/carrinho'
                                    onClick={() => setIsOpen(false)}
                                    className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                >
                                    <ShoppingCart className='w-5 h-5' />
                                    <span>Carrinho ({getItemsCount()})</span>
                                </Link>
                                <Link
                                    to='/admin/login'
                                    onClick={() => setIsOpen(false)}
                                    className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                >
                                    <User className='w-5 h-5' />
                                    <span>Admin</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;