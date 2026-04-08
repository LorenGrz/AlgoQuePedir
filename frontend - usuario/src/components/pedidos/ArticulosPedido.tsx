import React from 'react'
import type { Pedido } from '../../classes/Pedido'
import closeIcon from '../../assets/icons/x.svg'
import { Boton } from '../Boton'

type ArticulosPedidoProps = {
  pedido: Pedido
  onQuitarItem?: (idPlato: number) => void
}

export const ArticulosPedido: React.FC<ArticulosPedidoProps> = ({ pedido, onQuitarItem }) => {
  return (
    <section className="mb-6">
      <h2 className="font-medium mb-2">Artículos</h2>
      <div className="divide-y divide-gray-200">
        {pedido.items.map((item) => (
          <div key={item.plato.id} className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">{item.plato.nombre}</p>
              <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
              <p className="text-sm text-gray-500">
                Precio unitario: ${item.plato.precio.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-medium">${(item.cantidad * item.plato.precio).toFixed(2)}</p>

              {/* Botón de quitar (condicional) */}
              {pedido.esModificable() && (
                <Boton
                  tipo="imagen"
                  onClick={() => onQuitarItem?.(+item.plato.id)}
                  className=""
                  aria-label="Quitar item"
                >
                  <img src={closeIcon} alt="Quitar" className="w-5 h-5 cursor-pointer" />
                </Boton>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
