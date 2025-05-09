import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import ModalEliminarCompra from './ModalEliminarCompra';
import ModalAgregarCompra from './ModalAgregarCompra';
import ModalEditarCompra from './ModalEditarCompra';
import DownloadReportButton from './DownloadReportButton';

const PurchaseList = () => {
  const [compras, setCompras] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/compras');
      setCompras(response.data);
    } catch (error) {
      setMensaje('Error al obtener compras.');
      console.error('Error fetching purchases:', error);
    }
  };

  const handleAgregarCompra = async (nuevaCompra) => {
    try {
      await axios.post('http://localhost:5002/api/compras', nuevaCompra);
      fetchCompras(); // Vuelve a cargar las compras después de agregar
      setShowAgregarModal(false);
      setMensaje('Compra agregada exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar compra.');
      console.error('Error adding purchase:', error);
    }
  };

  const handleEditarCompra = async (compraActualizada) => {
    try {
      await axios.put(`http://localhost:5002/api/compras/${compraActualizada.ID_Compra}`, compraActualizada);
      fetchCompras();
      setShowEditarModal(false);
      setMensaje('Compra actualizada exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar compra: ${error.response?.data?.error || error.message}`);
      console.error('Error updating purchase:', error);
    }
  };

  const eliminarCompra = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/compras/${id}`);
      fetchCompras();
      setShowEliminarModal(false);
      setMensaje('Compra eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      setMensaje('Error al eliminar la compra.');
    }
  };

  const openEditarModal = (compra) => {
    setCompraSeleccionada(compra);
    setShowEditarModal(true);
  };

  const openEliminarModal = (compra) => {
    setCompraSeleccionada(compra);
    setShowEliminarModal(true);
  };

  return (
    <div className="main-content">
      <h1>Compras</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Compra</button>

      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Fecha Compra</th>
            <th>Número Compra</th>
            <th>Proveedor</th>
            <th>Nombre Producto</th>
            <th>Cantidad Comprada</th>
            <th>Precio Unitario (USD$)</th>
            <th>Subtotal (USD$)</th>
            <th>Total (USD$)</th>
            <th>Impuesto (USD$)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.length > 0 ? (
            compras.map(compra => (
              <tr key={compra.ID_Compra}>
                <td>{compra.fecha_compra}</td>
                <td>{compra.ID_Compra}</td>
                <td>{compra.ID_Proveedor}</td>
                <td>{compra.nombre_producto}</td>
                <td>{compra.cantidad_comprada}</td>
                <td>{compra.precio_unitario ? Number(compra.precio_unitario).toFixed(2) : "N/A"}</td>
                <td>{compra.subtotal ? Number(compra.subtotal).toFixed(2) : "0.00"}</td>
                <td>{compra.total_final ? Number(compra.total_final).toFixed(2) : "0.00"}</td>
                <td>{compra.impuesto ? Number(compra.impuesto).toFixed(2) : "0.00"}</td>
                <td>
                  <button onClick={() => openEditarModal(compra)}>Editar</button>
                  <button onClick={() => openEliminarModal(compra)}>Eliminar</button>
                </td>
             
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay compras disponibles.</td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Modales */}
      <ModalAgregarCompra
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarCompra}
      />

      {compraSeleccionada && (
        <ModalEditarCompra
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarCompra}
          compra={compraSeleccionada}
        />
      )}

      {compraSeleccionada && (
        <ModalEliminarCompra
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarCompra(compraSeleccionada.ID_Compra)}
        />
      )}
    </div>
  );
};

export default PurchaseList;