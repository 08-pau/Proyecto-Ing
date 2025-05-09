import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ModalAgregarCompra = ({ show, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    ID_Proveedor: '',
    impuestoPorcentaje: '',
    fecha_compra: '',
    nombre_producto: '',
    cantidad_comprada: '',
    precio_unitario: '',
    subtotal: '',
    impuesto: '',
    total_final: '',
  });
  const [proveedores, setProveedores] = useState([]);

  // useEffect para obtener proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5002/api/obtenerProveedores');
        setProveedores(respuesta.data);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    fetchProveedores();
  }, []);

  // Función para calcular totales
  const calcularTotales = useCallback(() => {
    const cantidad = Number(formData.cantidad_comprada) || 0;
    const precio = Number(formData.precio_unitario) || 0;
    const subtotal = cantidad * precio;
    const porcentajeImpuesto = Number(formData.impuestoPorcentaje) / 100 || 0;
    const impuesto = subtotal * porcentajeImpuesto;
    const total_final = subtotal + impuesto;

    setFormData((prevData) => ({
      ...prevData,
      subtotal: subtotal.toFixed(2),
      impuesto: impuesto.toFixed(2),
      total_final: total_final.toFixed(2),
    }));
  }, [formData.cantidad_comprada, formData.precio_unitario, formData.impuestoPorcentaje]);

  // useEffect para recalcular totales al cambiar campos relevantes
  useEffect(() => {
    calcularTotales();
  }, [formData.cantidad_comprada, formData.precio_unitario, formData.impuestoPorcentaje, calcularTotales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const nuevaCompra = {
        ...formData,
      };
      console.log('Información a enviar:', nuevaCompra);
      await onAdd(nuevaCompra);
      onClose();
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar compra</h2>
          <span className="close" onClick={onClose}>×</span>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="ID_Proveedor">Proveedor (*)</label>
          <select id="ID_Proveedor" name="ID_Proveedor" value={formData.ID_Proveedor} onChange={handleChange} required>
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.ID_Proveedor} value={proveedor.ID_Proveedor}>
                {proveedor.Nombre}
              </option>
            ))}
          </select>

          <label htmlFor="impuestoPorcentaje">Porcentaje de Impuesto (%) (*)</label>
          <input
            type="number"
            id="impuestoPorcentaje"
            name="impuestoPorcentaje"
            value={formData.impuestoPorcentaje}
            onChange={handleChange}
            required
            min="0"
          />

          <label htmlFor="nombre_producto">Nombre del Producto (*)</label>
          <input
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleChange}
            required
          />

          <label htmlFor="cantidad_comprada">Cantidad Comprada (*)</label>
          <input
            type="number"
            id="cantidad_comprada"
            name="cantidad_comprada"
            value={formData.cantidad_comprada}
            onChange={handleChange}
            required
          />

          <label htmlFor="precio_unitario">Precio Unitario (USD$) (*)</label>
          <input
            type="number"
            id="precio_unitario"
            name="precio_unitario"
            value={formData.precio_unitario}
            onChange={handleChange}
            required
          />

          <label htmlFor="fecha_compra">Fecha Compra (*)</label>
          <input
            type="date"
            id="fecha_compra"
            name="fecha_compra"
            value={formData.fecha_compra}
            onChange={handleChange}
            required
          />
        <h2>Totales</h2>
        <p>Subtotal: {formData.subtotal}</p>
        <p>Impuesto: {formData.impuesto}</p>
        <p>Total a Pagar: {formData.total_final}</p>
      
          <button type="button" onClick={handleSubmit} className="add-purchase-button">Agregar compra</button>
        </form>

        </div>
    </div>
  );
};

export default ModalAgregarCompra;
