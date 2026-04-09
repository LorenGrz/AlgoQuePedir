import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { pedidoService } from '../../../../lib/components/services/Pedido-service'
import { Pedido } from '../../../../lib/components/classes/Pedido.svelte'
import { API_URL } from '$lib/components/services/Variables-entorno'
import { EstadoPedidoModel } from '$lib/components/models/pedido-models'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  patch: ReturnType<typeof vi.fn>
}

describe('pedidoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe obtener un pedido por ID y devolver una instancia de Pedido', async () => {
    const mockResponse = {
      data: {
        id: 1,
        estado: 'Pendiente',
        cliente: { nombre: 'Juan', username: 'juan123', imgUrl: '/img/juan.png' },
        direccion: { direccion: 'Calle 123', latitud: -34.5, longitud: -58.4 },
        cantidadItems: 2,
        items: [
          { id: '1', nombre: 'Pizza', descripcion: 'Napolitana', precio: 2000, imgUrl: '/uploads/pizza.jpg' },
          { id: '2', nombre: 'Empanadas', descripcion: 'Carne', precio: 1500, imgUrl: '/uploads/emp.jpg' }
        ],
        pago: { subtotal: 3500, comisionDelivery: 0, incrementoPago: 0, total: 3500, metodoPago: 'Efectivo' }
      }
    }

    mockedAxios.get = vi.fn().mockResolvedValue(mockResponse)

    const pedido = await pedidoService.obtenerPedidoPorId('1')

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/pedidos/1`)
    expect(pedido.id).toBe('1')
    expect(pedido.cliente.nombre).toBe('Juan')
    expect(pedido.items).toHaveLength(2)
  })

  it('debe obtener pedidos por estado y devolver una lista de instancias de Pedido', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          estado: 'Pendiente',
          cliente: { nombre: 'Ana', username: 'ana1', imgUrl: '/img/ana.png' },
          direccion: { direccion: 'Av. Siempre Viva 742', latitud: 0, longitud: 0 },
          cantidadItems: 3,
          pago: { total: 4000, metodoPago: 'Efectivo' },
          fechaCreacion: '2024-10-15'
        },
        {
          id: 2,
          estado: 'Pendiente',
          cliente: { nombre: 'Luis', username: 'luis1', imgUrl: '/img/luis.png' },
          direccion: { direccion: 'Calle Falsa 123', latitud: 0, longitud: 0 },
          cantidadItems: 1,
          pago: { total: 2000, metodoPago: 'QR' },
          fechaCreacion: '2024-10-16'
        }
      ]
    }

    mockedAxios.get = vi.fn().mockResolvedValue(mockResponse)

    /* const localId = localStorage.getItem('localId')
    if (!localId) {
      throw new Error('localId no encontrado')
    } DEBERIAMOS CHEQUEAR LA INFO DEL LOCALSTORAGE 
      */
    

    const pedidos = await pedidoService.obtenerPedidosPorEstado(EstadoPedidoModel.Pendiente,1)
   
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/pedidos/estado/${EstadoPedidoModel.Pendiente}/1`)
    expect(pedidos).toHaveLength(2)
    pedidos.forEach(p => expect(p).toBeInstanceOf(Pedido))
    expect(pedidos[0].cliente.nombre).toBe('Ana')
  })

  it('debe cambiar el estado del pedido correctamente', async () => {
    const mockResponse = {
      data: {
        id: 1,
        estado: 'Preparado',
        cliente: { nombre: 'Juan', username: 'juan123', imgUrl: '/img/juan.png' },
        direccion: { direccion: 'Calle 123', latitud: -34.5, longitud: -58.4 },
        cantidadItems: 2,
        pago: { total: 3000, metodoPago: 'Efectivo' },
        fechaCreacion: '2024-10-15'
      }
    }

    mockedAxios.patch = vi.fn().mockResolvedValue(mockResponse)

    const pedido = await pedidoService.CambiarEstadoPedido(1, EstadoPedidoModel.Preparado)

    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API_URL}/pedidos/1/${EstadoPedidoModel.Preparado}`)
    expect(pedido.estado).toBe('Preparado')
  })

  it('debe lanzar error si no hay response al cambiar estado', async () => {
    mockedAxios.patch = vi.fn().mockResolvedValue(null)

    await expect(pedidoService.CambiarEstadoPedido(99, EstadoPedidoModel.Cancelado))
      .rejects
      .toThrow('Pedido no encontrado')
  })

  it('debe delegar correctamente a CambiarEstadoPedido al preparar o cancelar un pedido', async () => {
    const mockResponse = { data: { id: 1, estado: 'Preparado' } }
    mockedAxios.patch = vi.fn().mockResolvedValue(mockResponse)

    const pedidoPreparado = await pedidoService.prepararPedido(1)
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API_URL}/pedidos/1/${EstadoPedidoModel.Preparado}`)
    expect(pedidoPreparado.estado).toBe('Preparado')

    const mockResponseCancelado = { data: { id: 1, estado: 'Cancelado' } }
    mockedAxios.patch = vi.fn().mockResolvedValue(mockResponseCancelado)

    const pedidoCancelado = await pedidoService.cancelarPedido(1)
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API_URL}/pedidos/1/${EstadoPedidoModel.Cancelado}`)
    expect(pedidoCancelado.estado).toBe('Cancelado')
  })
})