import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalPromocionDescuento = ({ show, onClose, producto }) => {
  const [tipo, setTipo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [descuento, setDescuento] = useState('');
  const [precioProductoOriginal, setPrecioProductoOriginal] = useState(0);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [paso, setPaso] = useState(1);

  const [tipoPromo, setTipoPromo] = useState('');
  const [productoRelacionado, setProductoRelacionado] = useState('');
  const [precioRelacionado, setPrecioRelacionado] = useState(0);
  const [precioComboManual, setPrecioComboManual] = useState('');
  const [precioComboSugerido, setPrecioComboSugerido] = useState(0);
  const [idPromocion, setIdPromocion] = useState(null);

  useEffect(() => {
    if (!show) return;

    resetForm();

    axios.get('http://localhost:5002/api/ver_productos')
      .then(res => setProductosDisponibles(res.data))
      .catch(err => console.error('Error al obtener productos:', err));

    if (producto?.ID_Producto) {
      obtenerPrecioProducto(producto.ID_Producto)
        .then(precio => setPrecioProductoOriginal(Number(precio)));
    }
  }, [show, producto]);

  const resetForm = () => {
    setTipo('');
    setFechaInicio('');
    setFechaFin('');
    setDescuento('');
    setPaso(1);
    setTipoPromo('');
    setProductoRelacionado('');
    setPrecioRelacionado(0);
    setPrecioComboManual('');
    setPrecioComboSugerido(0);
    setIdPromocion(null);
  };

  const obtenerPrecioProducto = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5002/api/productos/${id}`);
      return res.data.Precio || 0;
    } catch (err) {
      console.error('Error al obtener precio del producto:', err);
      return 0;
    }
  };

  const handleGuardarPaso1 = async () => {
    if (!tipo || !fechaInicio || !fechaFin) {
      alert('Complete todos los campos del paso 1.');
      return;
    }

    const ID_Producto = producto.ID_Producto;

    if (tipo === 'descuento') {
      if (!descuento || descuento <= 0 || descuento > 100) {
        alert('Ingrese un descuento válido (1-100%).');
        return;
      }

      const monto_descuento = (descuento / 100) * precioProductoOriginal;
      const precio_descontado = precioProductoOriginal - monto_descuento;

      const payload = {
        ID_Producto,
        descuento,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        monto_descuento,
        precio_descontado,
      };

      try {
        await axios.post('http://localhost:5002/api/descuentos', payload);
        alert('Descuento guardado correctamente.');
        onClose();
      } catch (err) {
        console.error('Error al guardar descuento:', err);
        alert('Error al guardar descuento.');
      }

    } else if (tipo === 'promocion') {
      if (!tipoPromo) {
        alert('Seleccione el tipo de promoción.');
        return;
      }

      const payload = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        tipo_promocion: tipoPromo,
      };

      try {
        const res = await axios.post('http://localhost:5002/api/promociones', payload);
        setIdPromocion(res.data.idPromocion);
        setPaso(2);
      } catch (err) {
        console.error('Error al crear promoción:', err.response || err);
        alert('Error al guardar promoción.');
      }

    } else {
      alert('Tipo inválido');
    }
  };

  const handleSeleccionProductoRelacionado = async (e) => {
    const id = e.target.value;
    setProductoRelacionado(id);

    const precio = await obtenerPrecioProducto(id);
    setPrecioRelacionado(precio);
    setPrecioComboSugerido(precioProductoOriginal + Number(precio));
  };

  const guardarCombo = async () => {
    if (!productoRelacionado) {
        alert('Seleccione un producto relacionado.');
        return;
      }
  
      const precio_combo = tipoPromo === 'combo'
        ? (Number(precioComboManual) > 0 ? Number(precioComboManual) : precioComboSugerido)
        : 0;
  
      const payload = {
        ID_Promocion: idPromocion,
        ID_Producto: producto.ID_Producto,
        tipo_promocion: tipoPromo,
        producto_relacionado: productoRelacionado,
        precio_combo,
      };
  
      try {
        await axios.post('http://localhost:5002/api/promociones/detalle', payload);
        alert('Promoción guardada correctamente.');
        onClose();
      } catch (err) {
        console.error('Error al guardar detalle de promoción:', err);
        alert('Error al guardar detalle de promoción.');
      }
    };
  

  const guardarGratis = async () => {
    if (!productoRelacionado) {
      alert('Seleccione un producto gratis relacionado.');
      return;
    }

    const payloadGratis = {
      ID_Promocion: idPromocion,
      Producto_ID: producto.ID_Producto,
      Producto_Gratis_ID: productoRelacionado,
    };

    try {
      await axios.post('http://localhost:5002/api/promociones/detalle-producto-gratis', payloadGratis);
      alert('Promoción de producto gratis guardada correctamente.');
      onClose();
    } catch (err) {
      console.error('Error al guardar detalle de producto gratis:', err);
      alert('Error al guardar detalle de producto gratis.');
    }
  };

  const handleGuardarPaso2 = async () => {
    if (tipoPromo === 'combo') {
      await guardarCombo();
    } else if (tipoPromo === 'gratis') {
      await guardarGratis();
    } else {
      alert('Seleccione un tipo de promoción válido.');
    }
  };

  if (!show) return null;

  const precioCombo = tipoPromo === 'combo'
    ? (Number(precioComboManual) > 0 ? Number(precioComboManual) : precioComboSugerido)
    : 0;

  const precioProductoCombo = precioRelacionado;

  return (
    <div className="promo-modal-backdrop">
      <div className="promo-modal">
        <h2>Agregar Promoción o Descuento para: {producto?.Nombre}</h2>

        {paso === 1 && (
          <>
            <label>¿Qué desea agregar?</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Seleccione una opción</option>
              <option value="descuento">Descuento</option>
              <option value="promocion">Promoción</option>
            </select>

            {tipo === 'descuento' && (
              <>
                <label>Descuento (%)</label>
                <input type="number" min="1" max="100" value={descuento} onChange={e => setDescuento(e.target.value)} />
                <p>Precio Original: {precioProductoOriginal.toFixed(2)}</p>
                <p>Precio con Descuento: {(precioProductoOriginal - (descuento / 100) * precioProductoOriginal).toFixed(2)}</p>
              </>
            )}

            {tipo === 'promocion' && (
              <>
                <label>Tipo de Promoción</label>
                <select value={tipoPromo} onChange={e => setTipoPromo(e.target.value)}>
                  <option value="">Seleccione tipo</option>
                  <option value="combo">Combo con otro producto</option>
                  <option value="gratis">Producto gratis</option>
                </select>
              </>
            )}

            <label>Fecha Inicio</label>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            <label>Fecha Fin</label>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />

            <div className="form-buttons">
              <button className="btn btn-save" onClick={handleGuardarPaso1}>Guardar</button>
              <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}

        {paso === 2 && tipo === 'promocion' && (
          <>
            <label>Producto relacionado</label>
            <select value={productoRelacionado} onChange={handleSeleccionProductoRelacionado}>
              <option value="">Seleccione un producto</option>
              {productosDisponibles
                .filter(p => p.ID_Producto !== producto.ID_Producto)
                .map(p => (
                  <option key={p.ID_Producto} value={p.ID_Producto}>{p.Nombre}</option>
                ))}
            </select>

            {tipoPromo === 'combo' && (
              <div>
                <label>Precio del Combo</label>
                <input
                  type="number"
                  value={precioComboManual}
                  onChange={(e) => setPrecioComboManual(e.target.value)}
                  placeholder="Ingrese precio combo"
                />
                <p>Precio Total Combo: {Number(precioCombo).toFixed(2)}</p>
                <p>Producto Principal: {Number(precioProductoOriginal).toFixed(2)}</p>
                <p>Producto Combo: {Number(precioProductoCombo).toFixed(2)}</p>
              </div>
            )}

            <div className="form-buttons">
              <button className="btn btn-save" onClick={handleGuardarPaso2}>Guardar Promoción</button>
              <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalPromocionDescuento;
