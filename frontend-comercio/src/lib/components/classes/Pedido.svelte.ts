import { EstadoPedidoModel, MetodoPagoModel } from '$lib/components/models/pedido-models'
import type { PedidoDetalleResponse, PedidoResponse, PlatoDetalleModel } from '$lib/components/models/pedido-models'

export class Pedido {
  id: string = $state('')
  estado: EstadoPedidoModel = $state(EstadoPedidoModel.Pendiente)
  cliente = $state({
    nombre: '',
    username: '',
    imgUrl: ''
  })
  direccion = $state({
    direccion: '',
    latitud: 0,
    longitud: 0
  })
  items = $state<PlatoDetalleModel[]>([])
  cantidadItems: number = $state(0)
  pago = $state({
    subtotal: 0,
    comisionDelivery: 0,
    incrementoPago: 0,
    total: 0,
    metodoPago: MetodoPagoModel.Efectivo
  })
  fechaCreacion: string = $state('')

  fromJson(dto: Partial<PedidoResponse>): Pedido {
    this.id = dto.id?.toString() ?? ''
    this.estado = dto.estado as EstadoPedidoModel
    this.cliente = {
      nombre: dto.cliente?.nombre ?? '',
      username: dto.cliente?.username ?? '',
      imgUrl: dto.cliente?.imgUrl ?? ''
    }
    this.direccion = {
      direccion: dto.direccion?.direccion ?? '',
      latitud: dto.direccion?.latitud ?? 0,
      longitud: dto.direccion?.longitud ?? 0
    }
    this.cantidadItems = dto.cantidadItems ?? 0
    this.pago = {
      subtotal:  0, // No viene en el response
      comisionDelivery: 0, // No viene en el response
      incrementoPago: 0,   // No viene en el response
      total: dto.pago?.total ?? 0,
      metodoPago: dto.pago?.metodoPago as MetodoPagoModel ?? MetodoPagoModel.Efectivo
    }
    this.fechaCreacion = dto.fechaCreacion ?? ''
    return this
  }
  
  fromJsonDetalle(dto: Partial<PedidoDetalleResponse>): Pedido {
    //id
    this.id = dto.id?.toString() ?? ''
    //estado
    this.estado = dto.estado as EstadoPedidoModel
    //cliente
    this.cliente = dto.cliente ?? {
      nombre: '',
      username: '',
      imgUrl: ''
    }
    //direccion
    this.direccion = dto.direccion ?? {
      direccion: '',
      latitud: 0,
      longitud: 0
    }
    //items
    this.items = dto.items ?? [] 
    //pago
    this.pago = {
      subtotal: dto.pago?.subtotal ?? 0, 
      comisionDelivery: dto.pago?.comisionDelivery ?? 0, 
      incrementoPago: dto.pago?.incrementoPago ?? 0,   
      total: dto.pago?.total ?? 0,
      metodoPago: dto.pago?.metodoPago as MetodoPagoModel ?? MetodoPagoModel.Efectivo
    }
    return this 
  }
}