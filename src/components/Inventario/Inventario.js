// src/components/Inventario/Inventario.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from './Product';
import Section from './Section';
import './App.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/ver_productos');
      const productos = response.data.map(producto => ({
        ...producto,
        Precio: parseFloat(producto.Precio) || 0 
      }));
      setProductos(productos);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="content">
      <Section id="inventario" title="Inventario de los productos del Supermercado">
        {productos.map((producto, index) => (
          <Product 
            key={index} 
            name={producto.Nombre} 
            price={`₡${producto.Precio.toFixed(2)}`} 
            stock={producto.Stock}
          />
        ))}
      </Section>
    </div>
  );
};

export default Inventario;

