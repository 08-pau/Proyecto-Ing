import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalPromocionDescuento from './ModalPromocionDescuento';
import ModalAgregarProducto from './ModalAgregarProducto';
import ModalActualizarProducto from './ModalActualizarProductos';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [showPromocionModal, setShowPromocionModal] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/ver_productos');
      setProductos(response.data);
    } catch (error) {
      setMensaje('Error al obtener productos.');
      console.error('Error fetching products:', error);
    }
  };

  const handleAgregarProducto = (nuevoProducto) => {
    setProductos((prev) => [...prev, nuevoProducto]);
    setShowAgregarModal(false);
    setMensaje('Producto agregado exitosamente.');
    fetchProductos();
  };

  const handleEditarProducto = async (productoActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/productos/${productoActualizado.ID_Producto}`, productoActualizado);
      fetchProductos();
      setShowEditarModal(false);
      setMensaje('Producto actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar producto: ${error.response?.data?.error || error.message}`);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/productos/${id}`);
      fetchProductos();
      setShowEliminarModal(false);
      setMensaje('Producto eliminado exitosamente.');
    } catch (error) {
      setMensaje('Error al eliminar el producto.');
    }
  };

  const openEditarModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowEditarModal(true);
  };

  const openEliminarModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowEliminarModal(true);
  };

  const openPromocionDescuentoModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowPromocionModal(true);
  };

  const productosFiltrados = productos.filter((producto) => {
    const nombre = producto.Nombre?.toLowerCase() || '';
    const codigo = producto.Codigo?.toLowerCase() || '';
    const categoria = String(producto.ID_Categoria || '').toLowerCase();
    const termino = busqueda.toLowerCase();

    return (
      nombre.includes(termino) ||
      codigo.includes(termino) ||
      categoria.includes(termino)
    );
  });

  return (
    <div className="producto-main-content">
      <h1 className="producto-titulo-pago">Productos</h1>

      <div className="producto-acciones-top">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="producto-buscador-input"
        />
        <button className="producto-btn-agregar" onClick={() => setShowAgregarModal(true)}>
          Agregar Producto
        </button>
      </div>

      {mensaje && <p className="producto-mensaje">{mensaje}</p>}

      <div className="producto-tabla-scroll-container">
        <table className="producto-tabla-metodos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Impuesto</th>
              <th>Stock</th>
              <th>Código</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <tr key={producto.ID_Producto}>
                  <td>{producto.Nombre}</td>
                  <td>{producto.ID_Categoria}</td>
                  <td>{producto.ID_Impuesto}</td>
                  <td>{producto.Stock}</td>
                  <td>{producto.Codigo}</td>
                  <td>{producto.Precio}</td>
                  <td>
                    <button className="producto-btn-editar" onClick={() => openEditarModal(producto)}>Editar</button>
                    <button className="producto-btn-editar" onClick={() => openEliminarModal(producto)}>Eliminar</button>
                    <button className="producto-btn-editar" onClick={() => openPromocionDescuentoModal(producto)}>Promoción</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No se encontraron productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalAgregarProducto
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarProducto}
      />

      {productoSeleccionado && (
        <ModalActualizarProducto
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarProducto}
          producto={productoSeleccionado}
        />
      )}

      {productoSeleccionado && (
        <ModalConfirmarEliminar
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarProducto(productoSeleccionado.ID_Producto)}
        />
      )}

      {showPromocionModal && productoSeleccionado && (
        <ModalPromocionDescuento
          show={showPromocionModal}
          onClose={() => setShowPromocionModal(false)}
          producto={productoSeleccionado}
        />
      )}
    </div>
  );
};

export default Productos;
