
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'; //useParams para obtener el ID
import './ProductDetail.css';

const ProductDetail = ({ products, onAddToCart }) => {
  // Obtener el ID
  const { id } = useParams();
  
  // Convertierte el ID de la URL a número para la búsqueda
  const productId = parseInt(id); 

  // Buscar productos en el mock
  const product = products.find(p => p.id === productId);

    //Estado para la cantidad seleccionada por el usuario (por defecto: 1)
  const [quantity, setQuantity] = useState(1)

    // Función que llama a la función global con la cantidad
    const handleAddToCart = () => {
        // Llama a la función global "onAddToCart" y le pasa la cantidad.
        onAddToCart(product, quantity);
    };

  // En caso de producto no encontrado
  if (!product) {
    return <div className="product-not-found">
             <h1>Producto No Encontrado</h1>
             <p>Lo sentimos, el artículo que busca no existe.</p>
             <Link to="/">Volver a la tienda</Link>
           </div>;
  }

  // Lógica de precio y "Ahorro"
  const regularPrice = product.price * 1.2; // Simula un precio regular más alto
  const discountAmount = regularPrice - product.price;

  return (
    <div className="product-detail-page-container">
      
      {/* 1. seccion superior (imagen, precio y botones) */}
      <div className="top-section-wrapper">
        
        {/*Galería de Imágenes */}
        <div className="image-gallery">
          <img src={product.image} alt={product.name} className="main-product-image" />
        </div>

        {/*Información de Compra */}
        <div className="purchase-info">
          
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description-detail">
            {product.description}
          </p>

          <div className="price-box">
            <span className="regular-price-label">Precio Regular:</span>
            <span className="regular-price-value">${regularPrice.toFixed(2)}</span>
            
            <h2 className="current-price-value">
              ${product.price.toFixed(2)}
            </h2>
            <span className="discount-info">
              Ahorra: ${discountAmount.toFixed(2)}
            </span>
          </div>

          {/* Controles de Cantidad y Boton */}
          <div className="action-buttons-group">

            {/* Controles de cantidad con botones externos */}
            <div className="quantity-controls-wrapper">
                <button
                    className="quantity-btn decrement"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))} // funcion de decremento
                    disabled={quantity <= 1} // Deshabilita el botón si la cantidad es 1
                >
                    -
                </button>
                <input 
                    type="text"
                    readOnly 
                    value={quantity}
                    className='quantity-input'
                />
                <button 
                    className='quantity-btn increment'
                    onClick={() => setQuantity(prev => prev + 1)} //funcion de incremento
                >
                    +
                </button>
            </div>

            <button 
              className="btn-add-to-cart-detail" 
              onClick={handleAddToCart} // Llama a la función de compra
            >
              Agregar al Carrito
            </button>
          </div>

        </div>
      </div>
      
      {/* 2. seccion abajo: descripcion y detalles */}
      <div className="bottom-section-tabs">
        
        <div className="tabs-header">
          <button className="tab-button active">Descripción del producto</button>
          <button className="tab-button">Promesa de Entrega</button>
        </div>
        
        <div className="tab-content-wrapper">
          <h3 className="content-title">{product.name}</h3>
          
          {/* Contenido de Beneficios/Descripción */}
          <div className="benefits-section">
            <h4>Beneficios</h4>
            <ul className="benefits-list">
              <li>{product.description}</li>
              <li>Ayuda contra la gastritis aguda y crónica.</li>
              <li>Favorece la curación de la mucosa gástrica dañada.</li>
              <li>Útil para aliviar acidez, agruras, reflujo y ardor.</li>
            </ul>
          </div>

          {/* Columna de Detalles (a la derecha) */}
          <div className="details-sidebar">
            <div className="detail-item">
              <span>Beneficios</span>
              <span className="arrow">⬇️</span>
            </div>
            <div className="detail-item">
              <span>Instrucciones</span>
              <span className="arrow">⬇️</span>
            </div>
            {/* ... otros detalles ... */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;