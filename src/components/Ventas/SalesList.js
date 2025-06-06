import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generarFacturaPDF } from './DownloadReportButton';

import DetalleVenta from './DetalleVenta';
import ModalAgregarVenta from './ModalAgregarVenta';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';
import DownloadReportButton from './DownloadReportButton';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [idVentaDetalles, setIdVentaDetalles] = useState(null);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/Verventas');
      setVentas(response.data);
    } catch (error) {
      setMensaje('Error al obtener ventas.');
      console.error('Error fetching ventas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (idVenta, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5002/api/ventas/estado/${idVenta}`, {
        estado: nuevoEstado,
      });
      setMensaje(`Venta ${nuevoEstado === 1 ? 'procesada' : 'anulada'} correctamente.`);
      fetchVentas();
    } catch (error) {
      console.error('Error al cambiar el estado de la venta:', error);
      setMensaje('Error al cambiar el estado.');
    }
  };

  const fetchDetallesVenta = async (idVenta) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/detalles_venta/${idVenta}`);
      console.log('Detalles de venta:', response.data);
    } catch (error) {
      console.error('Error fetching sale details:', error.response ? error.response.data : error.message);
      setMensaje('Hubo un error al cargar los detalles de la venta.');
    }
  };

  const handleAgregarVenta = async (nuevaVenta) => {
    try {
      await axios.post('http://localhost:5002/api/ventas', nuevaVenta);
      fetchVentas();
      setShowAgregarModal(false);
      setMensaje('Venta agregada exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar venta.');
      console.error('Error adding venta:', error);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/ventas/${id}`);
      fetchVentas();
      setShowEliminarModal(false);
      setMensaje('Venta eliminada exitosamente.');
    } catch (error) {
      setMensaje('Error al eliminar venta.');
      console.error('Error deleting venta:', error);
    }
  };

  const openEliminarModal = (venta) => {
    setVentaSeleccionada(venta);
    setShowEliminarModal(true);
  };

  const seleccionarVentaParaReporte = (venta) => {
    setVentaSeleccionada(venta);
  };

  const ventasFiltradas = ventas.filter((venta) => {
    if (filtroEstado === 'procesadas') return venta.estado === 1;
    if (filtroEstado === 'anuladas') return venta.estado === 0;
    return true;
  });

 return (
<div className="venta-main-content">
  <h1 className="venta-titulo-pago">Gestión de Ventas</h1>

  {/* 🔍 Búsqueda y botón agregar */}
  <div className="venta-acciones-top">
    <input
      type="text"
      placeholder="Buscar venta..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="venta-buscador-input"
    />
    <button className="venta-btn-agregar" onClick={() => setShowAgregarModal(true)}>
      Agregar Venta
    </button>
  </div>

  {/* ✅ Filtros centrados debajo */}
  <div className="venta-tabs-separado">
    <button
      className={`venta-tab-btn ${filtroEstado === 'todas' ? 'active' : ''}`}
      onClick={() => setFiltroEstado('todas')}
    >
      Todas
    </button>
    <button
      className={`venta-tab-btn ${filtroEstado === 'procesadas' ? 'active' : ''}`}
      onClick={() => setFiltroEstado('procesadas')}
    >
      Procesadas
    </button>
    <button
      className={`venta-tab-btn ${filtroEstado === 'anuladas' ? 'active' : ''}`}
      onClick={() => setFiltroEstado('anuladas')}
    >
      Anuladas
    </button>
  </div>

   

    <div className="venta-tabla-container">
      <table className="venta-tabla">
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Usuario</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.length > 0 ? (
            ventasFiltradas.map((venta) => (
              <tr key={venta.ID_Venta}>
                <td>{venta.Numero}</td>
                <td>{new Date(venta.Fecha).toLocaleDateString()}</td>
                <td>{venta.ID_Cliente}</td>
                <td>{venta.ID_Usuario}</td>
                <td>{venta.ID_Metodo_Pago}</td>
                <td>
                  <span className={venta.estado === 1 ? 'venta-estado-procesado' : 'venta-estado-anulado'}>
                    {venta.estado === 1 ? 'Procesada' : 'Anulada'}
                  </span>
                  <br />
                  <button
                    className={`venta-btn-estado ${venta.estado === 1 ? 'venta-btn-anular' : 'venta-btn-procesar'}`}
                    onClick={() => handleToggleEstado(venta.ID_Venta, venta.estado)}
                  >
                    {venta.estado === 1 ? 'Anular' : 'Procesar'}
                  </button>
                </td>
                <td>
                  <div className="venta-acciones-botones">
                    <button className="venta-btn-ver" onClick={() => {
                      setIdVentaDetalles(venta.ID_Venta);
                      setShowDetallesModal(true);
                      fetchDetallesVenta(venta.ID_Venta);
                    }}>
                      Ver Detalles
                    </button>
                 <button
  className="venta-btn-reporte"
  onClick={() => generarFacturaPDF(venta)}
>
  Reporte
</button>

                   
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay ventas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>




      <ModalAgregarVenta
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarVenta}
      />

      {showDetallesModal && idVentaDetalles && (
        <DetalleVenta
          idVenta={idVentaDetalles}
          show={showDetallesModal}
          onClose={() => setShowDetallesModal(false)}
        />
      )}

      
    </div>
  );
};

export default Ventas;