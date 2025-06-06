// src/components/Inventario/Product.js
import React from 'react';
import './App.css';

function Product({ name, price, stock }) {
  return (
    <div className="product">
      <p><strong>Nombre:</strong> {name}</p>
      <p><strong>Precio:</strong> {price}</p>
      <p><strong>Stock:</strong> {stock}</p>
    </div>
  );
}

export default Product;
