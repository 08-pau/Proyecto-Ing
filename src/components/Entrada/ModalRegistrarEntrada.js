// ModalRegistrarEntrada.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylesEntrada.css';

function ModalRegistrarEntrada({ fetchEntradas, onClose, show }) {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    idProducto: '',
    cantidad: '',
    motivo: '',
    fechaEntrada: '',
  });
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [total, setTotal] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5002/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  useEffect(() => {
    if (formData.idProducto && formData.cantidad) {
      const prod = productos.find(p => p.ID_Producto === parseInt(formData.idProducto));
     if (prod) {
  setPrecioUnitario(prod.Precio); // ✅ campo correcto de la BD
  setTotal((prod.Precio * parseFloat(formData.cantidad)).toFixed(2));
}

    } else {
      setPrecioUnitario('');
      setTotal('');
    }
  }, [formData.idProducto, formData.cantidad, productos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5002/api/entradas', {
        ...formData,
        precioUnitario,
        total
      });
      setMensaje('Entrada registrada con éxito.');
      fetchEntradas();
      onClose();
    } catch (error) {
      setMensaje('Error al registrar la entrada.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="entrada-modal" style={{ display: show ? 'flex' : 'none' }}>
      <div className="entrada-modal-content">
        <div className="entrada-modal-header">
          <h2>Registrar Entrada</h2>
          <span className="entrada-close" onClick={onClose}>&times;</span>
        </div>

        {mensaje && <p className="entrada-error">{mensaje}</p>}

        <form onSubmit={handleSubmit}>
          <div className="entrada-form-group">
            <label>Producto</label>
            <select name="idProducto" value={formData.idProducto} onChange={handleChange} required>
              <option value="">Seleccionar producto</option>
              {productos.map((p) => (
                <option key={p.ID_Producto} value={p.ID_Producto}>{p.Nombre}</option>
              ))}
            </select>
          </div>

          <div className="entrada-form-group">
            <label>Cantidad</label>
            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
          </div>

          <div className="entrada-form-group">
            <label>Precio Unitario</label>
            <input type="text" value={precioUnitario} disabled />
          </div>

          <div className="entrada-form-group">
            <label>Motivo</label>
        <select name="motivo" value={formData.motivo} onChange={handleChange} required>
  <option value="">Seleccionar motivo</option>
  <option value="compra">Compra</option>
  <option value="devolucion_cliente">Devolución de Cliente</option>
  <option value="ajuste_positivo">Ajuste Positivo</option>
  <option value="promocion">Promoción Recibida</option>
  <option value="donacion">Donación Recibida</option>
  <option value="recuperacion">Recuperación</option>
  <option value="transferencia">Transferencia Interna</option>
</select>

          </div>

          <div className="entrada-form-group">
            <label>Fecha de Entrada</label>
            <input type="date" name="fechaEntrada" value={formData.fechaEntrada} onChange={handleChange} required />
          </div>

          <div className="entrada-form-group">
            <label>Total</label>
            <input type="text" value={total} disabled />
          </div>

          <div className="entrada-form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalRegistrarEntrada;
