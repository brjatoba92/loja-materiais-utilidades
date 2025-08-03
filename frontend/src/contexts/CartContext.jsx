import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  const addToCart = (produto, quantidade = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.id === produto.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantidade + quantidade
        if (newQuantity > produto.estoque) {
          toast.error('Quantidade excede o estoque disponível')
          return current
        }
        
        toast.success('Quantidade atualizada no carrinho')
        return current.map(item =>
          item.id === produto.id 
            ? { ...item, quantidade: newQuantity }
            : item
        )
      } else {
        if (quantidade > produto.estoque) {
          toast.error('Quantidade excede o estoque disponível')
          return current
        }
        
        toast.success('Produto adicionado ao carrinho')
        return [...current, { ...produto, quantidade }]
      }
    })
  }

  const removeFromCart = (produtoId) => {
    setItems(current => current.filter(item => item.id !== produtoId))
    toast.success('Produto removido do carrinho')
  }

  const updateQuantity = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId)
      return
    }

    setItems(current => 
      current.map(item => {
        if (item.id === produtoId) {
          if (quantidade > item.estoque) {
            toast.error('Quantidade excede o estoque disponível')
            return item
          }
          return { ...item, quantidade }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.preco * item.quantidade), 0)
  }

  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantidade, 0)
  }

  const getCashbackPoints = (total) => {
    return Math.floor(total / 50)
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemsCount,
    getCashbackPoints
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}