import { LocalCompleto } from '../models/localModels'
import type {
  Estado,
  ItemPedido,
  ResumenPedido,
  PedidoModel,
  DetallePedido,
  PedidoNuevo
} from '../models/pedidoModel'
import type { Plato } from '../models/platoModel'
import { authService } from '../services/AuthService'

export class Pedido {
  id: number | null = null
  items: ItemPedido[] = []
  estado: Estado = 'pendiente'
  total: number = 0
  fecha: string = ''
  cantArticulos: number | null = null
  local: LocalCompleto | null = null
  resumen: ResumenPedido = {
    subtotal: 0,
    recargoTipoPago: 0,
    tarifaEntrega: 0,
    total: 0
  }
  formaPago: string = 'efectivo'

  // Constructor: Acepta el objeto completo o null
  constructor(local: LocalCompleto | null = null, items: ItemPedido[] = []) {
    this.local = local
    this.items = items
    this.calcularResumen()
  }

  cancelarPedido() {
    this.estado = 'cancelado' as Estado
  }

  esModificable(): boolean {
    return this.id == null
  }

  calcularResumen() {
    const subtotal = this.items.reduce((acc, item) => {
      return acc + item.plato.precio * item.cantidad
    }, 0)
    let tarifaEntrega = 0
    if (this.local) {
      if (!this.local.envioGratis) {
        tarifaEntrega = 2000
      }
    }
    let recargoTipoPago = 0
    if (this.formaPago.toLowerCase() == 'tarjeta' || this.formaPago.toLowerCase() == 'qr') {
      recargoTipoPago = subtotal * 0.05
    }
    const total = subtotal + tarifaEntrega + recargoTipoPago
    this.resumen = {
      subtotal,
      recargoTipoPago,
      tarifaEntrega,
      total
    }
    this.total = total
  }

  static toPedidoNuevo(pedido: Pedido): PedidoNuevo {
    const pedidoNuevo: PedidoNuevo = {
      idCliente: authService.obtenerIdUsuarioActual(),
      idLocal: pedido.local?.id ?? 0,
      formaPago: pedido.formaPago,
      items: pedido.items
    }
    return pedidoNuevo
  }

  static fromPedidoModel(dto: PedidoModel): Pedido {
    const pedido = new Pedido()
    pedido.id = +dto.id
    pedido.estado = dto.estado
    pedido.fecha = dto.fecha
    pedido.cantArticulos = dto.cantArticulos
    pedido.total = dto.total
    const localArmado: LocalCompleto = {
      id: 0,
      nombre: dto.nombreLocal,
      img: dto.imgUrl,
      puntajeTotal: 0,
      totalVentas: 0,
      resenas: [],
      distanciaKm: 0,
      envioGratis: false,
      metodosDePago: []
    }
    pedido.local = localArmado

    return pedido
  }

  static fromDetallePedido(dto: DetallePedido): Pedido {
    const pedido = new Pedido(null, dto.items)
    pedido.id = +dto.id
    pedido.estado = dto.estado
    pedido.fecha = dto.fecha
    pedido.formaPago = dto.formaPago.toLowerCase()
    pedido.resumen = dto.resumen
    const localArmado: LocalCompleto = {
      id: 0,
      nombre: dto.local.nombre,
      img: dto.local.imagen,
      puntajeTotal: dto.local.calificacion | 0,
      totalVentas: 0,
      resenas: [],
      distanciaKm: dto.local.distanciaKm | 0,
      envioGratis: dto.local.envioGratis,
      metodosDePago: []
    }
    pedido.local = localArmado
    if (dto.resumen) {
      pedido.total = dto.resumen.total
    }
    pedido.cantArticulos = dto.items.reduce((acc, item) => acc + item.cantidad, 0)
    pedido.calcularResumen()

    return pedido
  }

  agregarItem(plato: Plato, cantidad: number): Pedido {
    const index = this.items.findIndex((i) => i.plato.id === plato.id)
    let nuevosItems: ItemPedido[]
    if (cantidad === 0) {
      nuevosItems = this.items.filter((i) => i.plato.id !== plato.id)
    } else if (index >= 0) {
      nuevosItems = [...this.items]
      nuevosItems[index] = { ...nuevosItems[index], cantidad }
    } else {
      nuevosItems = [...this.items, { plato, cantidad }]
    }
    const nuevoPedido = new Pedido(this.local, nuevosItems)
    Object.assign(nuevoPedido, this, { items: nuevosItems })
    nuevoPedido.calcularResumen()

    return nuevoPedido
  }

  quitarItem(idPlato: number): Pedido {
    const nuevosItems = this.items.filter((i) => i.plato.id !== idPlato)
    const nuevoPedido = new Pedido(this.local, nuevosItems)
    Object.assign(nuevoPedido, this, { items: nuevosItems })
    nuevoPedido.calcularResumen()

    return nuevoPedido
  }

  cambiarFormaPago(nuevaForma: string): Pedido {
    this.formaPago = nuevaForma
    // Recalculamos el resumen (por si aplica recargo)
    this.calcularResumen()

    const nuevoPedido = new Pedido(this.local, this.items)
    Object.assign(nuevoPedido, this)

    return nuevoPedido
  }

  agregarLocal(local: LocalCompleto): Pedido {
    const nuevoPedido = new Pedido(local, this.items)
    Object.assign(nuevoPedido, this, { local: local })

    if (local.metodosDePago && local.metodosDePago.length > 0) {
      const esPagoValido = local.metodosDePago.includes(this.formaPago)

      if (!esPagoValido) {
        nuevoPedido.formaPago = local.metodosDePago[0]
      }
    }
    nuevoPedido.calcularResumen()

    return nuevoPedido
  }

  totalItems(): number {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0)
  }
}
