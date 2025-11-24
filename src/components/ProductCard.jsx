// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">

      <Link to={`/producto/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image}
            alt="{`Imagen de ${product.name}`}" 
            className="product-image"
          />
        </div>
        <h3>{product.name}</h3>
      </Link>

      <p className="product-description">{product.description}</p>
      <p className="product-price">${product.price.toFixed(2)}</p>
      
      <button 
        className="btn-add-to-cart" 
        onClick={() => onAddToCart(product)} // 👈 Llama a la función del padre
      >
        Añadir a la Cesta
      </button>
    </div>
  );
};

export default ProductCard;