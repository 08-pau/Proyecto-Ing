import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylesVentas.css';

const ModalAgregarVenta = ({ show, onClose, onAdd }) => {
  const [formDataVenta, setFormDataVenta] = useState({
    idCliente: '',
    idUsuario: '',
    idMetodoPago: '',
    fecha: '',
    estado: 0, // 1 = procesada, 0 = anulada
  });

  const [formDataDetalle, setFormDataDetalle] = useState({
    idProducto: '',
    cantidad: '',
    precioUnitario: '',
    impuesto: '',
  });
  const [estadoVenta, setEstadoVenta] = useState(null); // Estado inicial vacío
  const [promoActual, setPromoActual] = useState({});
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios
  const [metodosPago, setMetodosPago] = useState([]); // Estado para los métodos de pago
  const [productos, setProductos] = useState([]); // Estado para los productos
  const [idVenta, setIdVenta] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (show) {
      const fetchClientes = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/VERRclientes');
          console.log('Clientes obtenidos:', response.data);
          setClientes(response.data); // Guardar los clientes en el estado
          if (response.data.length > 0) {
            setFormDataVenta((prevState) => ({
              ...prevState,
              idCliente: response.data[0].ID_Cliente, // Asignar el ID del primer cliente de la lista
            }));
          }
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
          setMensaje('No se pudieron cargar los clientes.');
        }
      };
      fetchClientes();
    }
  }, [show]);
  useEffect(() => {
    if (show) {
      const fetchProductos = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/productos');
          console.log('Productos obtenidos:', response.data);  // Verifica los datos en la consola
          setProductos(response.data);  // Actualiza el estado con todos los productos

          // Si tienes productos, selecciona el primer producto como predeterminado
          if (response.data.length > 0) {
            setFormDataDetalle((prevState) => ({
              ...prevState,
              idProducto: response.data[0].ID_Producto,
            }));
          }
        } catch (error) {
          console.error('Error al obtener los productos:', error);
          setMensaje('No se pudieron cargar los productos.');
        }
      };
      fetchProductos();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const fetchMetodosPago = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/VERRmetodos_pago');
          console.log('Métodos de pago obtenidos:', response.data);  // Verifica la respuesta aquí
          if (Array.isArray(response.data)) {
            setMetodosPago(response.data); // Guardar los métodos de pago en el estado
            if (response.data.length > 0) {
              setFormDataVenta((prevState) => ({
                ...prevState,
                idMetodoPago: response.data[0].ID_MetodoPago, // Asignar el primer método de pago
              }));
            }
          } else {
            console.error("La respuesta no es un arreglo válido:", response.data);
            setMensaje('No se pudieron cargar los métodos de pago.');
          }
        } catch (error) {
          console.error('Error al obtener los métodos de pago:', error);
          setMensaje('No se pudieron cargar los métodos de pago.');
        }
      };
      fetchMetodosPago();
    }
  }, [show]);


  useEffect(() => {
    if (show) {
      const fetchUsuarios = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/VERRusuarios');
          console.log('Usuarios obtenidos:', response.data);
          setUsuarios(response.data); // Guardar los usuarios en el estado
          if (response.data.length > 0) {
            setFormDataVenta((prevState) => ({
              ...prevState,
              idUsuario: response.data[0].ID_Usuario, // Asignar el primer usuario de la lista
            }));
          }
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
          setMensaje('No se pudieron cargar los usuarios.');
        }
      };
      fetchUsuarios();
    }
  }, [show]);

  const handleVentaChange = (e) => {
    const { name, value } = e.target;
    setFormDataVenta((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setFormDataDetalle({ ...formDataDetalle, [name]: value });
  };

  // Manejo de cambio de cliente
  const handleSelectCliente = (e) => {
    setFormDataVenta({ ...formDataVenta, idCliente: e.target.value });
  };

  // Manejo de cambio de usuario
  const handleSelectUsuario = (e) => {
    setFormDataVenta({ ...formDataVenta, idUsuario: e.target.value });
  };

  // Manejo de cambio de método de pago
  const handleSelectMetodoPago = (e) => {
    const metodoPagoId = parseInt(e.target.value, 10);  // Convierte el valor a un número entero
    setFormDataVenta({ ...formDataVenta, idMetodoPago: metodoPagoId });  // Actualiza el estado con un número
  };

  const handleProductoChange = async (e) => {
    const idProducto = e.target.value;
    setProductoSeleccionado(idProducto);

    // Buscar el producto en la lista local por si falla el fetch
    const productoLocal = productos.find(p => p.ID_Producto === parseInt(idProducto));

    try {
      // Obtener detalles completos del producto (precio e impuesto)
      const resProducto = await axios.get(`http://localhost:5002/api/producto/${idProducto}`);
      const dataProducto = resProducto.data;

      setFormDataDetalle({
        idProducto: dataProducto.ID_Producto || idProducto,
        cantidad: '',
        precioUnitario: dataProducto.Precio ?? productoLocal?.PrecioUnitario ?? '',
        impuesto: dataProducto.Impuesto ?? productoLocal?.Impuesto ?? '',
      });

    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      // fallback local
      setFormDataDetalle({
        idProducto,
        cantidad: '',
        precioUnitario: productoLocal?.PrecioUnitario ?? '',
        impuesto: productoLocal?.Impuesto ?? '',
      });
    }

    try {
      // Obtener promociones aplicables
      const response = await axios.get(`http://localhost:5002/api/promociones/${idProducto}`);
      const promoData = response.data;

      setPromoActual({
        descuento: promoData.descuento || null,
        productoGratis: promoData.producto_gratis || null,
        combo: promoData.combo || null,
      });
    } catch (error) {
      console.error("Error al obtener promociones:", error);
      setPromoActual({ descuento: null, productoGratis: null, combo: null });
    }
  };



  const guardarVenta = async () => {
    console.log('Datos de la venta:', formDataVenta);  // Verifica los valores antes de la validación

    const { idCliente, idUsuario, idMetodoPago, fecha } = formDataVenta;

    // Validación de campos
    if (!idCliente || !idUsuario || !idMetodoPago || !fecha) {
      setMensaje("Por favor, complete todos los campos de la venta.");
      return;
    }

    const fechaValida = Date.parse(fecha);
    if (isNaN(fechaValida)) {
      setMensaje("La fecha no tiene un formato válido.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/api/ventas', {
        idCliente: parseInt(idCliente, 10),
        idUsuario: parseInt(idUsuario, 10),
        idMetodoPago: parseInt(idMetodoPago, 10),
        fecha,
      });

      console.log('Venta guardada exitosamente:', response.data);
      setIdVenta(response.data.idVenta);  // Asumimos que la respuesta contiene el idVenta generado
      setMensaje("Venta agregada exitosamente.");
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      setMensaje('No se pudo guardar la venta.');
    }
  };


  const agregarProducto = () => {
    if (!idVenta) {
      setMensaje("Debe llenar y guardar primero la información de la venta antes de agregar productos.");
      return;
    }
    const { idProducto, cantidad, precioUnitario, impuesto } = formDataDetalle;

    if (!idProducto || !cantidad || !precioUnitario || impuesto === '') {
      setMensaje("Por favor, complete todos los campos de los detalles.");
      return;
    }

    const cantidadNum = parseFloat(cantidad);
    const impuestoNum = parseFloat(impuesto);
    let precioUnitarioNum = parseFloat(precioUnitario);
    let descripcionPromo = '';
    let tipoPromocion = 'normal';

    // ✅ Aplicar descuento si existe
    const descuento = promoActual?.descuento;
    if (descuento?.Porcentaje_Descuento) {
      const porcentaje = parseFloat(descuento.Porcentaje_Descuento);
      precioUnitarioNum *= (1 - porcentaje / 100);
      descripcionPromo = `${porcentaje}% OFF. Nuevo: ₡${precioUnitarioNum.toFixed(0)}`;
      tipoPromocion = 'descuento';
    }

    const subtotalProducto = cantidadNum * precioUnitarioNum;
    const totalProducto = subtotalProducto + (subtotalProducto * impuestoNum / 100);

    const productoPrincipal = {
      idProducto: parseInt(idProducto),
      nombre: productos.find(p => p.ID_Producto === parseInt(idProducto))?.Nombre,
      tipoPromocion,
      descripcionPromo,
      cantidad: cantidadNum,
      precioUnitario: precioUnitarioNum,
      subtotal: subtotalProducto,
      impuesto: impuestoNum,
      total: totalProducto
    };

    const nuevosProductos = [productoPrincipal];

    // ✅ Producto Gratis
    if (promoActual?.productoGratis) {
      const prodGratisId = promoActual.productoGratis.Producto_Gratis_ID;
      const prodGratis = productos.find(p => p.ID_Producto === prodGratisId);

      if (prodGratis) {
        nuevosProductos.push({
          idProducto: prodGratis.ID_Producto,
          nombre: prodGratis.Nombre,
          tipoPromocion: 'incluido',
          descripcionPromo: `Gratis con ${productoPrincipal.nombre}`,
          cantidad: 1,
          precioUnitario: 0,
          subtotal: 0,
          impuesto: 0,
          total: 0
        });
      }
    }

    // ✅ Producto Combo - Cantidad igual a la del producto principal
    if (promoActual?.combo?.Producto_Combo_ID) {
      const comboProductoId = promoActual.combo.Producto_Combo_ID;
      const prodCombo = productos.find(p => p.ID_Producto === comboProductoId);

      if (prodCombo) {
        nuevosProductos.push({
          idProducto: prodCombo.ID_Producto,
          nombre: prodCombo.Nombre,
          tipoPromocion: 'combo',
          descripcionPromo: `Incluido en combo con ${productoPrincipal.nombre}`,
          cantidad: cantidadNum, // 👈 cantidad igual a la del producto principal
          precioUnitario: 0,
          subtotal: 0,
          impuesto: 0,
          total: 0
        });
      }
    }
    setProductosAgregados([...productosAgregados, ...nuevosProductos]);
    setSubtotal(prev => prev + subtotalProducto);
    setTotal(prev => prev + totalProducto);

    // Reiniciar campos
    setFormDataDetalle({
      idProducto: productos.length > 0 ? productos[0].ID_Producto : '',
      cantidad: '',
      precioUnitario: '',
      impuesto: ''
    });
    setPromoActual({});
  };


  const eliminarProducto = (index) => {
    const producto = productosAgregados[index];
    setSubtotal(subtotal - producto.subtotal);
    setTotal(total - (producto.subtotal + producto.impuesto));
    setProductosAgregados(productosAgregados.filter((_, i) => i !== index));
  };

  const finalizarVenta = async () => {
    try {
      // Primero, procesamos los detalles de la venta y reducimos el stock de manera secuencial
      for (const producto of productosAgregados) {
        // Enviar los detalles de la venta
        await axios.post('http://localhost:5002/api/detalles-venta', {
          idVenta: idVenta,
          idProducto: producto.idProducto,
          cantidad: producto.cantidad,
          precioUnitario: producto.precioUnitario,
          subtotal: producto.subtotal || 0,
          total: producto.total || 0,
          impuesto: producto.impuesto || 0,
          tipoPromocion: producto.tipoPromocion || null,
          descripcionPromocion: producto.descripcionPromo || null
        });

        // Reducir stock solo para productos que no son incluidos/gratis
        if (producto.tipoPromocion !== 'incluido') {
          await reducirStock(producto.idProducto, producto.cantidad);
        }
      }

      // Ahora, marcamos la venta como procesada
      const response = await axios.put(`http://localhost:5002/api/ventas/estado/${idVenta}`, {
        estado: 1, // 1 para "Procesada" o el valor que se requiera
      });
      console.log('Venta finalizada:', response.data);

      // Actualizar el estado de la venta en el formulario
      setFormDataVenta({
        ...formDataVenta,
        estado: 1 // Actualiza el estado de la venta a procesada
      });

      setEstadoVenta(1); // Marcar la venta como procesada en el estado local
      setMensaje("Venta procesada exitosamente.");
      onClose();
    } catch (error) {
      console.error("Error al finalizar la venta:", error);
      setMensaje("No se pudo procesar la venta.");
    }
  };




  const reducirStock = async (idProducto, cantidad) => {
    try {
      // Corrige la URL usando comillas invertidas para la interpolación adecuada
      await axios.put(`http://localhost:5002/api/productos/${idProducto}/reducir-stock`, {
        cantidadReducir: cantidad,
      });
      console.log('Stock reducido exitosamente');
    } catch (error) {
      console.error('Error al reducir el stock:', error);
    }
  };
if (!show) return null; 
  return (
  <div className="venta-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="venta-modal-content">
      <div className="venta-modal-header">
        <h2>Agregar Venta</h2>
        {mensaje && <div className="venta-mensaje">{mensaje}</div>}
        <span className="venta-close" onClick={onClose}>&times;</span>
      </div>

      <div className="venta-form-section">
        <h3>Información de la Venta</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Select Cliente */}
          <div className="venta-form-group">
            <label>Seleccionar Cliente:</label>
            <select
              name="idCliente"
              value={formDataVenta.idCliente}
              onChange={handleSelectCliente}
              required
            >
              <option value="" disabled>Seleccione un cliente...</option>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <option key={`cliente-${cliente.ID_Cliente}`} value={cliente.ID_Cliente}>
                    {cliente.Nombre}
                  </option>
                ))
              ) : (
                <option value="">Cargando clientes...</option>
              )}
            </select>
          </div>

          {/* Select Usuario */}
          <div className="venta-form-group">
            <label>Seleccionar Usuario:</label>
            <select
              name="idUsuario"
              value={formDataVenta.idUsuario}
              onChange={handleSelectUsuario}
              required
            >
              <option value="" disabled>Seleccione un usuario...</option>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <option key={`usuario-${usuario.ID_Usuario}`} value={usuario.ID_Usuario}>
                    {usuario.Nombre}
                  </option>
                ))
              ) : (
                <option value="">Cargando usuarios...</option>
              )}
            </select>
          </div>

          {/* Select Método de Pago */}
          <div className="venta-form-group">
            <label>Seleccionar Método de Pago:</label>
            <select
              name="idMetodoPago"
              value={formDataVenta.idMetodoPago}
              onChange={handleSelectMetodoPago}
              required
            >
              <option value="" disabled>Seleccione un método de pago...</option>
              {metodosPago.length > 0 ? (
                metodosPago.map((metodo) => {
                  const metodoId = metodo.ID_Metodo_Pago;
                  return metodoId ? (
                    <option key={`metodoPago-${metodoId}`} value={metodoId}>
                      {metodo.Nombre}
                    </option>
                  ) : null;
                })
              ) : (
                <option value="">Cargando métodos de pago...</option>
              )}
            </select>
          </div>

          {/* Fecha */}
          <div className="venta-form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formDataVenta.fecha}
              onChange={handleVentaChange}
              required
            />
          </div>

          {idVenta && (
            <div className="venta-info-generada">
              <strong>Número de venta generado:</strong> {idVenta}
            </div>
          )}

          <div className="venta-form-buttons">
            <button type="button" className="venta-guardar" onClick={guardarVenta}>
              Guardar Venta
            </button>
            <button type="button" className="venta-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="venta-form-section">
        <h3>Detalles de Productos</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="venta-form-group">
            <label>Seleccionar Producto:</label>
            <select onChange={handleProductoChange} value={formDataDetalle.idProducto}>
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.ID_Producto} value={producto.ID_Producto}>
                  {producto.Nombre}
                </option>
              ))}
            </select>
          </div>

          {formDataDetalle.idProducto && (
            <div>
              <p>Precio Unitario: {formDataDetalle.precioUnitario}</p>
              <p>Impuesto: {formDataDetalle.impuesto}%</p>
              {promoActual && (
                <div className="venta-promo-info">
                  <p><strong>Promociones disponibles:</strong></p>
                  {promoActual.descuento && (
                    <>
                      <p>Porcentaje: {promoActual.descuento.Porcentaje_Descuento}%</p>
                      <p>Precio con descuento: {(formDataDetalle.precioUnitario * (1 - parseFloat(promoActual.descuento.Porcentaje_Descuento) / 100)).toFixed(2)}</p>
                    </>
                  )}
                  <p>Producto Gratis: {promoActual.productoGratis ? 'Sí ✅' : 'No ❌'}</p>
                  {promoActual.productoGratis && (
                    <p>Producto Gratis: {promoActual.productoGratis.Producto_Gratis_ID}</p>
                  )}
                  <p>Combo: {promoActual.combo ? 'Sí ✅' : 'No ❌'}</p>
                  {promoActual.combo && (
                    <p>Producto Combo: {promoActual.combo.ID_Producto_Combo}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="venta-form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              value={formDataDetalle.cantidad}
              onChange={handleDetalleChange}
              required
              placeholder="Cantidad"
            />
          </div>

          <div className="venta-form-buttons">
            <button type="button" className="venta-guardar" onClick={agregarProducto}>
              Agregar Producto
            </button>
          </div>
        </form>
      </div>

      <div className="venta-productos-agregados">
        <h3>Productos Agregados</h3>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Promoción</th>
              <th>Detalles</th>
              <th>Cant</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productosAgregados.map((producto, index) => (
              <tr key={`producto-${index}`}>
                <td>{producto.nombre}</td>
                <td>
                  {producto.tipoPromocion === 'descuento' && 'Descuento'}
                  {producto.tipoPromocion === 'incluido' && 'Incluido'}
                  {producto.tipoPromocion === 'combo' && 'Combo'}
                  {producto.tipoPromocion === 'normal' && '—'}
                </td>
                <td>{producto.descripcionPromo || '—'}</td>
                <td>{producto.cantidad}</td>
                <td>₡{parseFloat(producto.precioUnitario).toFixed(0)}</td>
                <td>₡{parseFloat(producto.total).toFixed(0)}</td>
                <td>
                  {producto.tipoPromocion !== 'incluido' && (
                    <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="venta-totales">
          <p>Subtotal: {subtotal}</p>
          <p>Total: {total}</p>
        </div>
      </div>

      <button className="venta-btn-save" onClick={finalizarVenta}>
        Finalizar Venta
      </button>
    </div>
  </div>
);


};

export default ModalAgregarVenta;
