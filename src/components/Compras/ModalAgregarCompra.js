import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ModalAgregarProducto from '../Productos/ModalAgregarProducto';

const ModalAgregarCompra = ({ show, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    ID_Proveedor: '',
    ID_Producto: '',
    cantidad_comprada: '',
    precio_unitario: '',
    fecha_compra: '',
    subtotal: '',
    impuesto: '',
    total_final: '',
  });

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [impuestoPorcentaje, setImpuestoPorcentaje] = useState('');
  const [showAgregarProducto, setShowAgregarProducto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProveedores, resProductos] = await Promise.all([
          axios.get('http://localhost:5002/api/obtenerProveedores'),
          axios.get('http://localhost:5002/api/obtenerProductos'),
        ]);
        setProveedores(resProveedores.data);
        setProductos(resProductos.data);
      } catch (error) {
        console.error('Error al cargar proveedores o productos:', error);
      }
    };

    if (show) fetchData();
  }, [show]);

  const calcularTotales = useCallback(() => {
    const cantidad = Number(formData.cantidad_comprada) || 0;
    const precio = Number(formData.precio_unitario) || 0;
    const subtotal = cantidad * precio;
    const impuesto = subtotal * (Number(impuestoPorcentaje) / 100 || 0);
    const total_final = subtotal + impuesto;

    setFormData((prevData) => ({
      ...prevData,
      subtotal: subtotal.toFixed(2),
      impuesto: impuesto.toFixed(2),
      total_final: total_final.toFixed(2),
    }));
  }, [formData.cantidad_comprada, formData.precio_unitario, impuestoPorcentaje]);

  useEffect(() => {
    calcularTotales();
  }, [formData.cantidad_comprada, formData.precio_unitario, impuestoPorcentaje, calcularTotales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'ID_Producto') {
      const productoSeleccionado = productos.find((p) => String(p.ID_Producto) === value);
      if (productoSeleccionado) {
        setFormData((prevData) => ({
          ...prevData,
          precio_unitario: productoSeleccionado.Precio,
        }));
      }
    }
  };

  const handleAgregarProductoNuevo = async (nuevoProducto) => {
    try {
      const res = await axios.get('http://localhost:5002/api/obtenerProductos');
      setProductos(res.data);
      setFormData((prevData) => ({
        ...prevData,
        ID_Producto: nuevoProducto.ID_Producto,
        precio_unitario: nuevoProducto.Precio,
      }));
    } catch (error) {
      console.error('Error actualizando lista de productos:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const nuevaCompra = {
        ...formData,
        impuestoPorcentaje,
      };
      await onAdd(nuevaCompra);
      onClose();
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  };
if (!show) return null; 
  return (

    <div className="compra-modal" style={{ display: show ? 'flex' : 'none' }}>
      <div className="compra-modal-content">
        <div className="compra-modal-header">
          <h2>Agregar Compra</h2>
          <span className="compra-close" onClick={onClose}>×</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="compra-form-group">
            <label>Proveedor</label>
            <select
              name="ID_Proveedor"
              value={formData.ID_Proveedor || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((p) => (
                <option key={p.ID_Proveedor} value={p.ID_Proveedor}>
                  {p.Nombre}
                </option>
              ))}
            </select>
          </div>

        <div className="compra-form-group">
  <label>Producto</label>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select
      name="ID_Producto"
      value={formData.ID_Producto || ""}
      onChange={handleChange}
      required
      style={{ flexGrow: 1 }}
    >
      <option value="">Seleccione un producto</option>
      {productos.map((prod) => (
        <option key={prod.ID_Producto} value={prod.ID_Producto}>
          {prod.Nombre}
        </option>
      ))}
    </select>
    <button
      type="button"
      className="producto-btn-agregar"
      style={{ padding: '6px 10px' }}
      onClick={() => setShowAgregarProducto(true)}
    >
      + Agregar
    </button>
  </div>
</div>


          <div className="compra-form-group">
            <label>Cantidad Comprada</label>
            <input
              type="number"
              name="cantidad_comprada"
              value={formData.cantidad_comprada || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="compra-form-group">
            <label>Precio Unitario (₡)</label>
            <input
              type="number"
              name="precio_unitario"
              value={formData.precio_unitario || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="compra-form-group">
            <label>Impuesto (%)</label>
            <input
              type="number"
              value={impuestoPorcentaje || ""}
              onChange={(e) => setImpuestoPorcentaje(e.target.value)}
              required
            />
          </div>

          <div className="compra-form-group">
            <label>Fecha de Compra</label>
            <input
              type="date"
              name="fecha_compra"
              value={formData.fecha_compra || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="compra-form-group">
            <label>Totales</label>
            <p>Subtotal: ₡{formData.subtotal}</p>
            <p>Impuesto: ₡{formData.impuesto}</p>
            <p>Total Final: ₡{formData.total_final}</p>
          </div>

          <div className="compra-form-buttons">
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>


      <ModalAgregarProducto
        show={showAgregarProducto}
        onClose={() => setShowAgregarProducto(false)}
        onAdd={(nuevoProducto) => {
          setShowAgregarProducto(false);
          handleAgregarProductoNuevo(nuevoProducto);
        }}
      />
</div>
   
  );
};

export default ModalAgregarCompra;

