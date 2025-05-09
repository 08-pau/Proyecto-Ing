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

    return (
        <div className="modal" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Editar Compra</h2>
                    <span className="close" onClick={onClose}>×</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre-del-proveedor">Proveedor</label>
                        <input 
                            type="text" 
                            id="nombre-del-proveedor" 
                            value={idProveedor} 
                            onChange={(e) => setIdProveedor(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre-del-producto">Producto</label>
                        <input 
                            type="text" 
                            id="nombre-del-producto" 
                            value={nombreProducto} 
                            onChange={(e) => setNombreProducto(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cantidad-comprada">Cantidad Comprada</label>
                        <input 
                            type="text" 
                            id="cantidad-comprada" 
                            value={cantidadComprada} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="precio-unitario">Precio Unitario</label>
                        <input 
                            type="text" 
                            id="precio-unitario" 
                            value={precioUnitario} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subtotal">Subtotal</label>
                        <input 
                            type="text" 
                            id="subtotal" 
                            value={subtotal} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="total-final">Total Final</label>
                        <input 
                            type="text" 
                            id="total-final" 
                            value={totalFinal} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha-compra">Fecha de Compra</label>
                        <input 
                            type="date" 
                            id="fecha-compra" 
                            value={fechaCompra} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="impuesto">Impuesto</label>
                        <input 
                            type="text" 
                            id="impuesto" 
                            value={impuestoPorcentaje} 
                            disabled // Bloqueado para edición
                        />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarCompra;
