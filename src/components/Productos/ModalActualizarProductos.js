import React, { useState, useEffect } from 'react';

const ModalActualizarProducto = ({ show, onClose, onEdit, producto }) => {
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idImpuesto, setIdImpuesto] = useState('');
  const [stock, setStock] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    if (producto) {
      setNombre(producto.Nombre);
      setIdCategoria(producto.ID_Categoria);
      setIdImpuesto(producto.ID_Impuesto);
      setStock(producto.Stock);
      setCodigo(producto.Codigo);
      setPrecio(producto.Precio);
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!producto.ID_Producto) {
      console.error('ID_Producto no está definido');
      return;
    }
    const updatedProducto = { 
      ID_Producto: producto.ID_Producto, // Asegúrate de incluir el ID
      Nombre: nombre, 
      ID_Categoria: idCategoria, 
      ID_Impuesto: idImpuesto, 
      Stock: stock,  
      Codigo: codigo, 
      Precio: precio 
    };
    onEdit(updatedProducto);  // Pasar el producto actualizado
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Producto</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product-name">Nombre</label>
            <input type="text" id="product-name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="product-category">ID Categoría</label>
            <input type="number" id="product-category" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="product-tax">ID Impuesto</label>
            <input type="number" id="product-tax" value={idImpuesto} onChange={(e) => setIdImpuesto(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="product-stock">Stock</label>
            <input type="number" id="product-stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="product-code">Código</label>
            <input type="text" id="product-code" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="product-price">Precio</label>
            <input type="number" step="0.01" id="product-price" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} required />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ModalActualizarProducto;
