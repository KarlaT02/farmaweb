// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import "./App.css";

const PRODUCTS_MOCK = [
  { id: 1, name: 'Multivitamínico Senior', price: 15.50, description: 'Fórmula completa para la vitalidad diaria.', image: '/images/aspirina.png' },
  { id: 2, name: 'Crema para Articulaciones', price: 22.00, description: 'Alivio rápido para dolor y rigidez.', image: '/images/diclofenaco.png' },
  { id: 3, name: 'Tensiómetro Digital', price: 59.99, description: 'Pantalla grande, medición automática.', image: '/images/loratadina.png' },
  { id: 4, name: 'Pastillero Semanal Grande', price: 9.95, description: 'Organizador de medicinas, fácil de abrir.', image: '/images/naproxeno.png' },
];

// Componente que define la estructura de la página principal (Home)
const HomePage = ({ products, addToCart, cartItems }) => {
  return (
    <main className='main-layout'>
      <h2>Productos Destacados para Usted</h2>
      <ProductList
        products={PRODUCTS_MOCK}
        onAddToCart={addToCart}
      />
    </main>
  )
}


function App() {
  const [cartItems, setCartItems] = useState([]);

  // Lógica para añadir un producto al carrito
  const addToCart = (productToAdd, quantityToAdd = 1) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.id === productToAdd.id);

      if (exists) {
        // Si ya existe, aumenta la cantidad (quantity)
        return prevItems.map(item =>
          item.id === productToAdd.id 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      } else {
        // Si es nuevo, lo añade con cantidad 1
        return [...prevItems, { ...productToAdd, quantity: quantityToAdd }];
      }
    });
  };

  // Eliminar el item del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Lógica para el contador de items en el Header
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* BrowserRouter envuelve toda la aplicación para habilitar el ruteo */}
      <BrowserRouter>
        {/* El Header es Fijo y siempre visible */}
        <Header cartItemCount={totalCartItems} />

        {/* Routes define las posibles rutas de la aplicación */}
        <Routes>
          {/* Ruta del Home (página principal) */}
          <Route
            path="/"
            element={
              <HomePage
                products={PRODUCTS_MOCK}
                addToCart={addToCart}
                cartItems={cartItems}
              />
            }
          />

          <Route
            path='/producto/:id'
            element={
              <ProductDetail
                products={PRODUCTS_MOCK} ///Lista de buscar el producto
                onAddToCart={addToCart} /// Pasar a funcion de compra
              />
            }
          />

          {/* Ruta del Login */}
          <Route path="/login" element={<AuthPage />} />

          {/* Ruta del Registro */}
          <Route path="/registro" element={<AuthPage />} />

          <Route 
            path="/carrito" 
            element={ 
             <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
             />
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App