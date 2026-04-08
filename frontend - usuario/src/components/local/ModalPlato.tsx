import { useState } from 'react'
import type { Plato } from '../../models/platoModel'
import type { Pedido } from '../../classes/Pedido'
import { Boton } from '../Boton'
import cart from '../../assets/icons/cart.svg'
import { useOnInit } from '../../utils/hooks'

type Props = {
  plato: Plato
  pedido: Pedido
  setPedido: (p: Pedido) => void
  onClose: () => void
}

export const ModalPlato = ({ plato, pedido, setPedido, onClose }: Props) => {
  const [cantidad, setCantidad] = useState(0)
  const [enCarro, setEnCarro] = useState(false)

  useOnInit(() => {
    /* cuando renderizo el modal, necesito mostrar la cantidad de ese plato que tengo en el pedido,
    en caso contrario se muestra la cantidad inicial minima para agregar (1) */
    const platoEnPedido = pedido.items.find((i) => i.plato.id === plato.id)
    if (platoEnPedido && platoEnPedido.cantidad > 0) {
      setCantidad(platoEnPedido.cantidad)
      setEnCarro(true)
    }

    document.body.style.overflow = 'hidden'
  })

  const agregarAlPedido = () => {
    setPedido(pedido.agregarItem(plato, cantidad))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-end sm:items-center z-50"
      data-testid="modal-sombra"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-lg p-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen */}
        <img
          src={plato.img}
          alt={plato.nombre}
          className="w-full h-54 object-cover rounded-xl mb-4"
        />

        {/* Info plato */}
        <div className="flex items-center justify-between mb-2 gap-2.5">
          <h2 className="text-xl font-semibold text-gray-900 ">{plato.nombre}</h2>
          {enCarro && (
            <img src={cart} alt="" className="w-6 h-6 text-white" data-testid="modalCart" />
          )}
        </div>

        <p className="text-gray-500 text-sm mb-2">{plato.descripcion}</p>
        <p className="text-gray-700 mb-5">
          <span className="font-medium">Precio unitario:</span> ${plato.precio}
        </p>

        {/* Contador */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg mb-2">
          <button
            onClick={() => setCantidad((prev) => Math.max(0, prev - 1))}
            className="bg-red-600 text-white w-18 h-11 rounded-lg font-semibold cursor-pointer hover:bg-red-700 max-sm:w-15 max-sm:h-9"
          >
            -
          </button>
          <span className="text-lg font-semibold" data-testid="cantidadPlato">
            {cantidad}
          </span>
          <button
            onClick={() => setCantidad((prev) => prev + 1)}
            className="bg-red-600 text-white w-18 h-11 rounded-lg font-semibold cursor-pointer hover:bg-red-700 max-sm:w-15 max-sm:h-9"
          >
            +
          </button>
        </div>

        {/* Precio total */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Precio total</span>
          <span className="text-lg font-medium text-gray-900">
            ${(plato.precio * cantidad).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-3 text-sm">
          <Boton tipo="gris" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton tipo="primario" onClick={() => agregarAlPedido()}>
            {enCarro ? 'Editar Pedido' : 'Agregar al Pedido'}
          </Boton>
        </div>
      </div>
    </div>
  )
}
