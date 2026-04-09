import type { Estado } from '../../models/pedidoModel'
import { Pedido } from '../../classes/Pedido'
import { Link } from 'react-router-dom'
import { getMensajeError, type ErrorCustom, type ErrorResponse } from '../../utils/errorHandling'
import { Boton } from '../../components/Boton'
import React, { useState } from 'react'
import { pedidoService } from '../../services/pedidoService'
import { ErrorIcon } from '../../components/ErrorIcon'

interface CardPedidoProps {
  pedido: Pedido
  estadoActivo: Estado
  onCancelSuccess: (pedidoId: number) => void
}

export const CardPedido = ({ pedido, estadoActivo, onCancelSuccess }: CardPedidoProps) => {
  const [isCanceling, setIsCanceling] = useState(false)
  const [error, setError] = useState<ErrorCustom | null>(null)
  const handleCancelarClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsCanceling(true)
    setError(null)

    try {
      await pedidoService.cancelarPedido(pedido.id!)
      onCancelSuccess(pedido.id!)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    } finally {
      setIsCanceling(false)
    }
  }
  return (
    <Link
      to={`/detalle-pedidos/${pedido.id}`}
      className="group flex items-center bg-white rounded-2xl shadow-sm p-3 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md hover:bg-gray-50"
    >
      <img
        src={pedido.local?.img}
        alt={pedido.local?.nombre}
        className="w-16 h-16 rounded-xl object-cover mr-3"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 group-hover:text-black">
          {pedido.local?.nombre}
        </h3>
        <p className="text-gray-700 text-sm">Total: ${pedido.total?.toFixed(2)}</p>
        <p className="text-gray-500 text-xs">
          {formatIsoDateToDayAndMonth(pedido.fecha)} • {pedido.cantArticulos} artículos
        </p>
      </div>

      {/* Botón de cancelar */}
      {estadoActivo !== 'cancelado' && (
        <div onClick={(e) => e.preventDefault()}>
          <div>
            {isCanceling ? (
              <div className="text-gray-500 px-4">Cancelando...</div>
            ) : (
              <Boton
                tipo="custom"
                onClick={handleCancelarClick}
                className="py-3 px-4 bg-red-600 text-white hover:bg-red-700 rounded-b-full rounded-t-full cursor-pointer"
                disabled={isCanceling}
              >
                Cancelar
              </Boton>
            )}
            {error && <p>{<ErrorIcon />}</p>}
          </div>
        </div>
      )}
    </Link>
  )
}

const formatIsoDateToDayAndMonth = (isoString: string): string => {
  if (!isoString) return 'Fecha no disponible'
  const fecha = new Date(isoString)
  if (isNaN(fecha.getTime())) return 'Fecha inválida'
  const opcionesFormato: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
  return new Intl.DateTimeFormat('es-ES', opcionesFormato).format(fecha)
}
