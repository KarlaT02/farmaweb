// src/components/Cart.jsx

import React from "react";
import "./Cart.css";
import { Link } from "react-router-dom";

const Cart = ({ items, onUpdateQuantity, onRemove }) => {
  
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );
  const taxRate = 0.16; // IVA del 16% (ejemplo)
  const totalTax = subtotal * taxRate;
  const finalTotal = subtotal + totalTax;

  return (
    <div className="cart-page-container">
      <h1>🛒 Cesta de Compras</h1>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <p>Tu cesta está vacía. ¡Añade medicamentos o suplementos para iniciar tu compra!</p>
          <Link to="/" className="btn-continue-shopping">Seguir Comprando</Link>
        </div>
      ) : (
        <div className="cart-content-wrapper">
          
          <table className="cart-table">
            <thead>
              <tr>
                <th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="cart-item-row">
                  <td className="item-text">
                    <span>{item.name}</span>
                  </td>
                  <td className="item-details">
                    <img src={item.image} alt={item.name} className="item-thumbnail" />
                  </td>
                  <td data-label="Precio">${item.price.toFixed(2)}</td>
                  <td className="quantity-controls" data-label="Cantidad">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input type="number" readOnly value={item.quantity} />
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td data-label="Total">${(item.price * item.quantity).toFixed(2)}</td>
                  <td data-label="Acción">
                    <button className="btn-remove" onClick={() => onRemove(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary-container">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>IVA ({taxRate * 100}%):</span><span>${totalTax.toFixed(2)}</span></div>
            <div className="summary-total"><span>Total Final:</span><span>${finalTotal.toFixed(2)}</span></div>
            
            <button className="btn-checkout-final">FINALIZAR COMPRA</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;