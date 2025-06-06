import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModalRegistrarSalida({ fetchSalidas, onClose, show }) {
const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    idProducto: '',
    cantidad: '',
    tipoSalida: '',

    fechaSalida: '',
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
        setPrecioUnitario(prod.Precio);
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
      await axios.post('http://localhost:5002/api/salidas', {
        ...formData,
        precioUnitario,
        total
      });
      setMensaje('Salida registrada con éxito.');
      fetchSalidas();
      onClose();
    } catch (error) {
      setMensaje('Error al registrar la salida.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="proveedor-modal" style={{ display: show ? 'flex' : 'none' }}>
      <div className="proveedor-modal-content">
        <div className="proveedor-modal-header">
          <h2>Registrar Salida</h2>
          <span className="proveedor-close" onClick={onClose}>&times;</span>
        </div>

        {mensaje && <p className="proveedor-error">{mensaje}</p>}

        <form onSubmit={handleSubmit}>
          <div className="proveedor-form-group">
            <label>Producto</label>
            <select name="idProducto" value={formData.idProducto} onChange={handleChange} required>
              <option value="">Seleccionar producto</option>
              {productos.map((p) => (
                <option key={p.ID_Producto} value={p.ID_Producto}>{p.Nombre}</option>
              ))}
            </select>
          </div>

          <div className="proveedor-form-group">
            <label>Cantidad</label>
            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
          </div>

          <div className="proveedor-form-group">
            <label>Precio Unitario</label>
            <input type="text" value={precioUnitario} disabled />
          </div>

          <div className="proveedor-form-group">
            <label>Motivo</label>
          <select name="tipoSalida" value={formData.tipoSalida} onChange={handleChange} required>
  <option value="">Seleccionar motivo</option>
  <option value="devolucion">Devolución</option>
  <option value="vencimiento">Vencimiento</option>
  <option value="mal estado">Mal estado</option>
</select>

          </div>

          <div className="proveedor-form-group">
            <label>Fecha de salida</label>
            <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} required />
          </div>

          <div className="proveedor-form-group">
            <label>Total</label>
            <input type="text" value={total} disabled />
          </div>

          <div className="proveedor-form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default ModalRegistrarSalida;
