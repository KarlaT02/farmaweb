// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import { supabase } from './supabaseClient';
import "./App.css";


// Componente que define la estructura de la página principal (Home)
const HomePage = ({ products, addToCart, cartItems }) => {
  return (
    <main className='main-layout'>
      <h2>Productos Destacados para Usted</h2>
      <ProductList
        products={products}
        onAddToCart={addToCart}
      />
    </main>
  )
}


function App() {

  // Estado para almacenar productos cargados de Supabase
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); // Para mostrar un mensaje de carga
  const [cartItems, setCartItems] = useState([]);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

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

  const handleLogout = async () => {

    if (session) {

      // Guarda el carrito actual en la DB antes de salir (si está logueado)
      const cartData = JSON.stringify(cartItems);
      const { error: dbError } = await supabase
        .from('carts')
        .upsert({ user_id: session.user.id, items: cartData }, { onConflict: 'user_id' });
      
      if(dbError) {
        console.error('Error al guardar el carrito antes de logout:', dbError);
      }

    }

    // Limpia el estado local del carrito inmediatamente
    setCartItems([]);
    // Limpia el carrito en local store
    localStorage.removeItem('local_cart');

    /// cierra la sesion
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error al cerrar sesión:', error);
      ///alert("ocurrio un error al cerrar sesion");
  };


  const loadCartFromLocalStorage = () => {
    const localCart = localStorage.getItem('local_cart');
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (e) {
        console.error('Error al parsear carrito local:', e);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  const loadCartFromDatabase = async (userId) => {
    let { data, error } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('Error al cargar el carrito desde DB:', error);
      loadCartFromLocalStorage();
    } else if (data && data.items) {
      try {
        setCartItems(JSON.parse(data.items));
      } catch (e) {
        console.error('Error al pasear carrito de DB:', e);
        setCartItems([]);
      }
    }else {
      // Si no hay carrito en DB, carga desde local storage por si acaso
      loadCartFromLocalStorage();
    }
  };

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });


    ///Escucha cambios de sesionn logout/login
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => { ///Usamos newSession para obtener el valor más reciente
        setSession(newSession);

        // Recargar carrito al cambiar la sesión (login o logout)
        if (newSession && newSession.user) {
          // Usuario acaba de iniciar sesión: CARGA desde DB
          loadCartFromDatabase(newSession.user.id);
        } else{
          // Usuario acaba de cerrar sesión: Limpiar el carrito local (si no lo hace el logout)
          loadCartFromLocalStorage();
        }
      }
    );

    async function fetchProducts() {

      let { data: productsData, error } = await supabase
        .from('products')
        .select('*');


      if (error) {
        console.error('Error al cargar productos:', error);
      } else {
        setProducts(productsData);
      }
      setLoading(false); //Carga los productos

    }

    fetchProducts();

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      listener.subscription.unsubscribe();
    };
    
  }, []); // El array vacío asegura que se ejecute solo una vez al montar 

  useEffect(() => {
    // Convertir cartItems a string para guardarlo
    const cartData = JSON.stringify(cartItems);

    if (loadingAuth || loading) return; // Esperar a que todo se cargue

    if (session) {

        const saveTimeout = setTimeout(async () => {
            // Opción A: USUARIO LOGUEADO -> Guardar en Supabase (cada vez que cartItems cambia)
            async function saveCartToDatabase(cartData, userId) {
              // SOLO INTENTAR GUARDAR SI LA SESIÓN TIENE EL TOKEN (lo cual es cierto si hay 'session')
              if (!userId) {
                  console.warn ("Intento de guardar en DB sin user ID. Usando LocalStorage.")
                  return;
              }

              const { error: updateError } = await supabase
                .from('carts')
                .update({items: cartData})
                .eq('user_id', userId);

              if (updateError) {
                // 2. Si la actualización falla (ej: la fila no existe), intentamos INSERTAR
                if (updateError.code === 'PGRST116' || updateError.code === '42501') {

                    console.log("Fila no existe o RLS falló la actualización. Intentando INSERTAR.");

                    const { error: insertError } = await supabase
                      .from('carts')
                      .insert({ user_id: userId, items: cartData });
                    
                    if (insertError) {
                      console.error("Error FATAL al INSERTAR el carrito:", insertError);
                    } else {
                      console.log("Carrito insertado con éxito!");
                    }

                } else {
                    // Error de conexión o RLS distinto al de 'no encontrado'
                    console.error('Error al actualizar el carrito:', updateError);
                }

              } else {
                console.log('Carrito actualizado con éxito!');
              }

            }

            saveCartToDatabase();
            
        }, 500);

        // Limpia el timeout si el componente se vuelve a cambiar
        return () => clearTimeout(saveTimeout);

    } else {
      // Opción B: USUARIO NO LOGUEADO -> Guardar en Local Storage
      localStorage.setItem('local_cart', cartData);
    }
  }, [cartItems, session, loadingAuth, loading]); // Dependencias: cartItems, session, y estados de carga

  // Lógica para el contador de items en el Header
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Pantalla de carga, productos y autenticacion
  if (loading || loadingAuth) {
      return (
        <div className="app-container">
          <h1 className='main-layout' style={{textAlign: 'center', padding: '50px'}}>Verificando sesión y cargando datos...</h1>
        </div>
      );
  }

  return (

    <div className="app-container">
      {/* BrowserRouter envuelve toda la aplicación para habilitar el ruteo */}
      <BrowserRouter>
        {/* El Header es Fijo y siempre visible */}
        <Header cartItemCount={totalCartItems} session={session} onLogout={handleLogout} />

        {/* Routes define las posibles rutas de la aplicación */}
        <Routes>
          {/* Ruta del Home (página principal) */}
          <Route
            path="/"
            element={
                <HomePage
                  products={products}
                  addToCart={addToCart}
                  cartItems={cartItems}
                /> 
            }
          />

          <Route
            path='/producto/:id'
            element={
              <ProductDetail
                products={products} ///Lista de buscar el producto
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