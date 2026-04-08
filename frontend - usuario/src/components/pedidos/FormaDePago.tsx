import React from 'react'
import { Pedido } from '../../classes/Pedido'

type FormaDePagoProps = {
  pedido: Pedido
  valorActual: string
  onChangePago?: (nuevoValor: string) => void
}

export const FormaDePago: React.FC<FormaDePagoProps> = ({ pedido, valorActual, onChangePago }) => {
  // Obtenemos las opciones del local. Si no hay info, por defecto 'Efectivo'.
  const opcionesDePago =
    pedido.local?.metodosDePago && pedido.local.metodosDePago.length > 0
      ? pedido.local.metodosDePago
      : ['Efectivo']

  // Renderizado si el pedido se puede editar
  if (pedido.esModificable()) {
    return (
      <section className="mb-6">
        <label htmlFor="formaPago" className="block font-medium mb-2">
          Forma de pago
        </label>
        <select
          id="formaPago"
          value={valorActual}
          onChange={(e) => onChangePago?.(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-white"
        >
          {/* Mapeamos las opciones dinámicas del local */}
          {opcionesDePago.map((opcion) => (
            <option key={opcion.toString()} value={opcion.toString()}>
              {opcion.toUpperCase()}
            </option>
          ))}
        </select>
      </section>
    )
  }
  return (
    <section>
      <h2 className="font-medium mb-1">Forma de pago</h2>
      <p className="text-gray-700 capitalize">{valorActual.toUpperCase()}</p>
    </section>
  )
}
