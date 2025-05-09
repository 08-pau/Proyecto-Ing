import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalPromocionDescuento from './ModalPromocionDescuento';
import ModalAgregarProducto from './ModalAgregarProducto'; // Modal para agregar producto
import ModalActualizarProducto from './ModalActualizarProductos';
import ModalConfirmarEliminar from './ModalConfirmarEliminar'; // Modal para confirmar eliminación
const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
 const [showPromocionModal, setShowPromocionModal] = useState(false);
  
 const openPromocionDescuentoModal = (producto) => {
  console.log("Producto seleccionado:", producto);  // Verifica que el producto no sea null o undefined
  setProductoSeleccionado(producto);
  setShowPromocionModal(true);  // Esto hace que el modal se muestre
};

  {productoSeleccionado && (
    <ModalPromocionDescuento
      show={showPromocionModal}
      onClose={() => setShowPromocionModal(false)}
      producto={productoSeleccionado}
    />
  )}
  

  useEffect(() => {
    fetchProductos(); // Obtener productos al montar el componente
  }, []);

  
  // Función para obtener los productos
  const fetchProductos = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/ver_productos');
      setProductos(response.data);
    } catch (error) {
      setMensaje('Error al obtener productos.');
      console.error('Error fetching products:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEditarProducto = async (productoActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/productos/${productoActualizado.ID_Producto}`, productoActualizado);
      fetchProductos(); // Actualiza la lista de productos
      setShowEditarModal(false);
      setMensaje('El producto actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar producto: ${error.response?.data?.error || error.message}`);
      console.error('Error updating product:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/productos/${id}`);
      fetchProductos(); // Vuelve a cargar la lista de productos
      setShowEliminarModal(false); // Cierra el modal después de eliminar
      setMensaje('El producto eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
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
  const handleAgregarProducto = (nuevoProducto) => {
    // Actualiza la lista de productos con el nuevo producto
    setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    setShowAgregarModal(false);
    setMensaje('Producto agregado exitosamente.');
  };
  return (
    <div className="main-content">
      <h1>Productos</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Producto</button>

      {/* Mensaje de éxito o error */}
      {mensaje && <p>{mensaje}</p>}

      <table>
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
          {productos.length > 0 ? (
            productos.map(producto => (
              <tr key={producto.ID_Producto}>
                <td>{producto.Nombre}</td>
                <td>{producto.ID_Categoria}</td>
                <td>{producto.ID_Impuesto}</td>
                <td>{producto.Stock}</td>
                <td>{producto.Codigo}</td>
                <td>{producto.Precio}</td>
                <td>
                  <button onClick={() => openEditarModal(producto)}>Editar</button>
                  <button onClick={() => openEliminarModal(producto)}>Eliminar</button>
                  <button onClick={() => openPromocionDescuentoModal(producto)}>
  Agregar Promoción/Descuento
</button>

                </td>
              </tr>
              
            ))
          ) : (
            <tr>
              <td colSpan="9">No hay productos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

       {/* Modales */}
       <ModalAgregarProducto
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarProducto} // Pasa la función handleAgregarProducto
      />


      {productoSeleccionado && (
        <ModalActualizarProducto
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarProducto}
          producto={productoSeleccionado}
        />
      )}
{showPromocionModal && productoSeleccionado && (
  <ModalPromocionDescuento
    show={showPromocionModal}
    onClose={() => setShowPromocionModal(false)}
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
    </div>
  );
};

export default Productos;

