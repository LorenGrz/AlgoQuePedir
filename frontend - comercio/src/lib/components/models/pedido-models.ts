/* Tenemos que usar Plato para mandarle a PlatoMenu */
export enum EstadoPedidoModel {
  Cancelado = 'CANCELADO',
  Entregado = 'ENTREGADO',
  Pendiente = 'PENDIENTE',
  Preparado = 'PREPARADO'
}
export enum MetodoPagoModel {
  Efectivo = 'EFECTIVO',
  Tarjeta = 'TARJETA',
  Qr = 'QR'
}
export interface PedidoDetalleResponse {
  id: number
  estado: string
  cliente: ClienteModel
  direccion: DireccionModel
  cantidadItems: number
  items: PlatoDetalleModel[]
  pago: PagoPedidoDetalleResponse
}
export interface PedidoResponse {
  id: number
  estado: string
  cliente: ClienteModel
  direccion: DireccionModel
  cantidadItems: number
  pago: PagoPedidoResponse
  fechaCreacion: string // LocalDate se maneja como string en JSON
}
export interface DireccionModel {
  direccion: string;
  latitud: number;
  longitud: number;
}

export interface ClienteModel {
  nombre: string;
  username: string;
  imgUrl: string;
}
export interface PagoPedidoDetalleResponse {
  subtotal: number
  comisionDelivery: number
  incrementoPago: number
  total: number
  metodoPago: string
}
export interface PagoPedidoResponse {
  total: number
  metodoPago: string
}

export interface PlatoDetalleModel {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  cantidad: number;
}