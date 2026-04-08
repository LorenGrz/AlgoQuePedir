import type { Plato } from '../models/platoModel'

export type Estado = 'pendiente' | 'entregado' | 'cancelado'
export const ESTADOS_VALIDOS: Estado[] = ['pendiente', 'entregado', 'cancelado']
export type PedidoModel = {
  id: string
  estado: Estado
  nombreLocal: string
  total: number
  fecha: string
  cantArticulos: number
  imgUrl: string
}
export type PedidoNuevo = {
  idCliente: number | null
  idLocal: number
  items: ItemPedido[]
  formaPago: string
}
export type DetallePedido = {
  id: string
  estado: Estado
  local: LocalResumen
  items: ItemPedido[]
  resumen: ResumenPedido
  formaPago: string
  fecha: string
}
export type LocalResumen = {
  nombre: string
  imagen: string
  calificacion: number
  distanciaKm: number
  envioGratis: boolean
}
export type ResumenPedido = {
  subtotal: number
  recargoTipoPago: number
  tarifaEntrega: number
  total: number
}
export type ItemPedido = {
  plato: Plato
  cantidad: number
}
