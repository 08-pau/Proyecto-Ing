import React, { useState, useEffect } from 'react';

const ModalEditarCompra = ({ show, onClose, onEdit, compra }) => {
    const [idProveedor, setIdProveedor] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [cantidadComprada, setCantidadComprada] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [subtotal, setSubtotal] = useState('');
    const [totalFinal, setTotalFinal] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [impuestoPorcentaje, setImpuestoPorcentaje] = useState('');

    useEffect(() => {
        if (compra) {
            setIdProveedor(compra.ID_Proveedor);
            setNombreProducto(compra.nombre_producto);
            setCantidadComprada(compra.cantidad_comprada);
            setPrecioUnitario(compra.precio_unitario);
            setSubtotal(compra.subtotal);
            setTotalFinal(compra.total_final);
            const formattedDate = new Date(compra.fecha_compra).toISOString().split('T')[0];
            setFechaCompra(formattedDate);
            setImpuestoPorcentaje(compra.impuesto); 
        }
    }, [compra]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const compraActualizada = {
            ID_Compra: compra.ID_Compra,
            ID_Proveedor: idProveedor,
            nombre_producto: nombreProducto,
            cantidad_comprada: cantidadComprada,
            precio_unitario: precioUnitario,
            subtotal,
            total_final: totalFinal,
            fecha_compra: fechaCompra,
            impuesto: impuestoPorcentaje, // Asegúrate de usar 'impuesto' en vez de 'impuestoPorcentaje'
        };

        console.log(compraActualizada);
        onEdit(compraActualizada);
    };
if (!show) return null; 
    return (
  <div className="compra-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="compra-modal-content">
      <div className="compra-modal-header">
        <h2>Editar Compra</h2>
        <span className="compra-close" onClick={onClose}>×</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="compra-form-group">
          <label htmlFor="compra-proveedor">Proveedor</label>
          <input
            type="text"
            id="compra-proveedor"
            value={idProveedor}
            onChange={(e) => setIdProveedor(e.target.value)}
            required
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-producto">Producto</label>
          <input
            type="text"
            id="compra-producto"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            required
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-cantidad">Cantidad Comprada</label>
          <input
            type="text"
            id="compra-cantidad"
            value={cantidadComprada}
            disabled
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-precio">Precio Unitario</label>
          <input
            type="text"
            id="compra-precio"
            value={precioUnitario}
            disabled
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-subtotal">Subtotal</label>
          <input
            type="text"
            id="compra-subtotal"
            value={subtotal}
            disabled
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-total">Total Final</label>
          <input
            type="text"
            id="compra-total"
            value={totalFinal}
            disabled
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-fecha">Fecha de Compra</label>
          <input
            type="date"
            id="compra-fecha"
            value={fechaCompra}
            disabled
          />
        </div>

        <div className="compra-form-group">
          <label htmlFor="compra-impuesto">Impuesto</label>
          <input
            type="text"
            id="compra-impuesto"
            value={impuestoPorcentaje}
            disabled
          />
        </div>

        <div className="compra-form-buttons">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalEditarCompra;
