import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onAddToCart }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} // 👈 Pasa la función a cada tarjeta
        />
      ))}
    </div>
  );
};

export default ProductList;