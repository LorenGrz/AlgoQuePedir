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
      className="group flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"
    >
      <img
        src={pedido.local?.img}
        alt={pedido.local?.nombre}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
          {pedido.local?.nombre}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-0.5">
          ${pedido.total?.toFixed(2)}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
          {formatIsoDateToDayAndMonth(pedido.fecha)} · {pedido.cantArticulos} artículo{pedido.cantArticulos !== 1 ? 's' : ''}
        </p>
      </div>

      {estadoActivo !== 'cancelado' && (
        <div onClick={(e) => e.preventDefault()} className="flex-shrink-0">
          {isCanceling ? (
            <span className="text-xs text-gray-400 px-3">Cancelando…</span>
          ) : (
            <Boton
              tipo="custom"
              onClick={handleCancelarClick}
              className="py-2 px-4 text-sm bg-rose-600 text-white hover:bg-rose-700 rounded-full cursor-pointer transition-colors font-medium"
              disabled={isCanceling}
            >
              Cancelar
            </Boton>
          )}
          {error && <p><ErrorIcon /></p>}
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
