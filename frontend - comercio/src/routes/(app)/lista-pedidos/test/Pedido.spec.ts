import { describe, it, expect, beforeEach } from 'vitest'
import { Pedido } from '$lib/components/classes/Pedido.svelte'
import { EstadoPedidoModel, MetodoPagoModel } from '$lib/components/models/pedido-models'

describe('Pedido', () => {
  let pedido: Pedido

  beforeEach(() => {
    pedido = new Pedido()
  })

  it('inicializa con valores por defecto correctos', () => {
    expect(pedido.id).toBe('')
    expect(pedido.estado).toBe(EstadoPedidoModel.Pendiente)
    expect(pedido.cliente).toEqual({ nombre: '', username: '', imgUrl: '' })
    expect(pedido.direccion).toEqual({ direccion: '', latitud: 0, longitud: 0 })
    expect(pedido.items).toEqual([])
    expect(pedido.cantidadItems).toBe(0)
    expect(pedido.pago).toEqual({
      subtotal: 0,
      comisionDelivery: 0,
      incrementoPago: 0,
      total: 0,
      metodoPago: MetodoPagoModel.Efectivo
    })
  })

  it('fromJson carga correctamente los datos desde un PedidoResponse', () => {
    const dto = {
      id: 5,
      estado: EstadoPedidoModel.Preparado,
      cliente: { nombre: 'Lucía', username: 'lucia1', imgUrl: '/img/lucia.png' },
      direccion: { direccion: 'Av. Mitre 123', latitud: -34.6, longitud: -58.4 },
      cantidadItems: 3,
      pago: { total: 5500, metodoPago: MetodoPagoModel.Tarjeta },
      fechaCreacion: '2025-10-15'
    }

    const resultado = pedido.fromJson(dto)

    expect(resultado).toBeInstanceOf(Pedido)
    expect(resultado.id).toBe('5')
    expect(resultado.estado).toBe(EstadoPedidoModel.Preparado)
    expect(resultado.cliente.nombre).toBe('Lucía')
    expect(resultado.direccion.direccion).toBe('Av. Mitre 123')
    expect(resultado.cantidadItems).toBe(3)
    expect(resultado.pago.total).toBe(5500)
    expect(resultado.pago.metodoPago).toBe(MetodoPagoModel.Tarjeta)
    expect(resultado.fechaCreacion).toBe('2025-10-15')
  })

  it('fromJson usa valores por defecto cuando faltan campos en el DTO', () => {
    const dto = {
      id: undefined,
      cliente: undefined,
      direccion: undefined,
      pago: undefined
    }

    const resultado = pedido.fromJson(dto)

    expect(resultado.id).toBe('')
    expect(resultado.cliente.nombre).toBe('')
    expect(resultado.direccion.latitud).toBe(0)
    expect(resultado.pago.total).toBe(0)
  })

  it('fromJsonDetalle carga correctamente un pedido detallado con items y pago', () => {
    const dto = {
      id: 10,
      estado: EstadoPedidoModel.Entregado,
      cliente: { nombre: 'Carlos', username: 'carlitos', imgUrl: '/img/carlos.png' },
      direccion: { direccion: 'San Martín 456', latitud: -34.55, longitud: -58.45 },
      items: [
        { id: '1', nombre: 'Pizza', descripcion: 'Muzzarella', precio: 2500, imgUrl: '/uploads/pizza.jpg', cantidad: 1},
        { id: '2', nombre: 'Empanadas', descripcion: 'Carne', precio: 1800, imgUrl: '/uploads/emp.jpg' , cantidad: 1}
      ],
      pago: {
        subtotal: 4300,
        comisionDelivery: 200,
        incrementoPago: 0,
        total: 4500,
        metodoPago: MetodoPagoModel.Qr
      }
    }

    const resultado = pedido.fromJsonDetalle(dto)

    expect(resultado.id).toBe('10')
    expect(resultado.estado).toBe(EstadoPedidoModel.Entregado)
    expect(resultado.items).toHaveLength(2)
    expect(resultado.pago.subtotal).toBe(4300)
    expect(resultado.pago.total).toBe(4500)
    expect(resultado.pago.metodoPago).toBe(MetodoPagoModel.Qr)
  })

  it('fromJsonDetalle usa valores por defecto cuando faltan campos en el DTO', () => {
    const dto = {
      id: undefined,
      cliente: undefined,
      direccion: undefined,
      items: undefined,
      pago: undefined
    }

    const resultado = pedido.fromJsonDetalle(dto)

    expect(resultado.id).toBe('')
    expect(resultado.cliente.username).toBe('')
    expect(resultado.direccion.direccion).toBe('')
    expect(resultado.items).toEqual([])
    expect(resultado.pago.total).toBe(0)
  })
})