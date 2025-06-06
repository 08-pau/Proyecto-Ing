import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalEliminarCompra from './ModalEliminarCompra';
import ModalAgregarCompra from './ModalAgregarCompra';
import ModalEditarCompra from './ModalEditarCompra';
import './stylesCompras.css';

const PurchaseList = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/compras');
      setCompras(response.data);
    } catch {
      setMensaje('Error al obtener compras.');
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const obtenerNombreProveedor = (id) => {
    const proveedor = proveedores.find(p => p.ID_Proveedor === id);
    return proveedor ? proveedor.Nombre : `ID ${id}`;
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CR');
  };

  const handleAgregarCompra = async (nuevaCompra) => {
    try {
      await axios.post('http://localhost:5002/api/compras', nuevaCompra);
      fetchCompras();
      setShowAgregarModal(false);
      setMensaje('Compra agregada exitosamente.');
    } catch {
      setMensaje('Error al agregar compra.');
    }
  };

  const handleEditarCompra = async (compraActualizada) => {
    try {
      await axios.put(`http://localhost:5002/api/compras/${compraActualizada.ID_Compra}`, compraActualizada);
      fetchCompras();
      setShowEditarModal(false);
      setMensaje('Compra actualizada exitosamente.');
    } catch {
      setMensaje('Error al actualizar compra.');
    }
  };

  const eliminarCompra = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/compras/${id}`);
      fetchCompras();
      setShowEliminarModal(false);
      setMensaje('Compra eliminada exitosamente.');
    } catch {
      setMensaje('Error al eliminar la compra.');
    }
  };

  const comprasFiltradas = compras.filter((compra) =>
    obtenerNombreProveedor(compra.ID_Proveedor).toLowerCase().includes(busqueda.toLowerCase())
  );

return (
  <div className="compra-main-content">
    <h1 className="compra-titulo-pago">Compras</h1>

    <div className="compra-acciones-top">
      <input
        type="text"
        placeholder="Buscar proveedor..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="compra-buscador-input"
      />
      <button className="compra-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Compra
      </button>
    </div>

    {mensaje && <p className="compra-mensaje">{mensaje}</p>}

    <div className="compra-tabla-container">
      <table className="compra-tabla">
        <thead>
          <tr>
            <th>Fecha Compra</th>
            <th>Proveedor</th>
            <th>Cantidad Comprada</th>
            <th>Precio Unitario (USD$)</th>
            <th>Subtotal (USD$)</th>
            <th>Total (USD$)</th>
            <th>Impuesto (USD$)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.length > 0 ? (
            comprasFiltradas.map(compra => (
              <tr key={compra.ID_Compra}>
                <td>{formatearFecha(compra.fecha_compra)}</td>
                <td>{obtenerNombreProveedor(compra.ID_Proveedor)}</td>
                <td>{compra.cantidad_comprada}</td>
                <td>{Number(compra.precio_unitario).toFixed(2)}</td>
                <td>{Number(compra.subtotal).toFixed(2)}</td>
                <td>{Number(compra.total_final).toFixed(2)}</td>
                <td>{Number(compra.impuesto).toFixed(2)}</td>
                <td>
                  <div className="compra-acciones-botones">
                    <button
                      className="compra-btn-editar"
                      onClick={() => {
                        setCompraSeleccionada(compra);
                        setShowEditarModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="compra-btn-eliminar"
                      onClick={() => {
                        setCompraSeleccionada(compra);
                        setShowEliminarModal(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8">No hay compras disponibles.</td></tr>
          )}
        </tbody>
      </table>
    </div>





      <ModalAgregarCompra show={showAgregarModal} onClose={() => setShowAgregarModal(false)} onAdd={handleAgregarCompra} />
      {compraSeleccionada && (
        <>
          <ModalEditarCompra show={showEditarModal} onClose={() => setShowEditarModal(false)} onEdit={handleEditarCompra} compra={compraSeleccionada} />
          <ModalEliminarCompra show={showEliminarModal} onClose={() => setShowEliminarModal(false)} onDelete={() => eliminarCompra(compraSeleccionada.ID_Compra)} />
        </>
      )}
    </div>
  );
};

export default PurchaseList;

