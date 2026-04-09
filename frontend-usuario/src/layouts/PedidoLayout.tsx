// PedidoLayout.tsx
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Pedido } from '../classes/Pedido'

export type OutletContextType = {
  pedido: Pedido
  setPedido: (pedido: Pedido) => void
}

export const PedidoLayout = () => {
  const [pedido, setPedido] = useState<Pedido>(new Pedido())

  return <Outlet context={{ pedido, setPedido }} />
}
