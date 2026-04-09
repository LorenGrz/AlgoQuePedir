import React from 'react'
import type { Pedido } from '../../classes/Pedido' // Ajusta la ruta

type ResumenPedidoProps = {
  pedido: Pedido
}

export const ResumenPedidoSection: React.FC<ResumenPedidoProps> = ({ pedido }) => {
  if (pedido.resumen == null) {
    return null
  }
  return (
    <section className="mb-6">
      <h2 className="font-medium mb-2">Resumen</h2>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${pedido.resumen.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Recargo por tipo de pago</span>
          <span>${pedido.resumen.recargoTipoPago.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de entrega</span>
          <span>${pedido.resumen.tarifaEntrega.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
          <span>Total</span>
          <span>${pedido.resumen.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  )
}
