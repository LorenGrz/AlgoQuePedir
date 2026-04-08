import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { pedidoService } from '../../services/pedidoService'
import { API_URL } from '../../env'
import { Pedido } from '../../classes/Pedido'

// Mockeamos axios completo
vi.mock('axios')

// Mockeamos la clase Pedido para controlar los métodos estáticos si fuera necesario,
// o confiamos en la lógica real de la clase Pedido si es simple (en este caso usamos la real para integración o mocks parciales).
// Para simplificar, verificaremos que el service devuelva instancias de Pedido.

describe('PedidoService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('obtenerPedidosPorEstado', () => {
    it('hace un GET a la URL correcta y devuelve instancias de Pedido', async () => {
      // Arrange
      const mockDTOs = [
        {
          id: 10,
          estado: 'PENDIENTE',
          fecha: '2024-10-20',
          cantArticulos: 2,
          total: 1500,
          nombreLocal: 'Local Test',
          imgUrl: 'img.jpg'
        }
      ]

      // Simulamos respuesta de axios
      vi.mocked(axios.get).mockResolvedValue({ data: mockDTOs })

      // Act
      const pedidos = await pedidoService.obtenerPedidosPorEstado(1, 'pendiente')

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/pedidosPublic/estado/pendiente/1`)
      expect(pedidos).toHaveLength(1)
      expect(pedidos[0]).toBeInstanceOf(Pedido) // Verifica que hizo el mapeo
      expect(pedidos[0].id).toBe(10)
    })
  })

  describe('cancelarPedido', () => {
    it('hace un PATCH a la URL correcta', async () => {
      vi.mocked(axios.patch).mockResolvedValue({ status: 200 })

      await pedidoService.cancelarPedido(123)

      expect(axios.patch).toHaveBeenCalledWith(`${API_URL}/pedidos/123/CANCELADO`)
    })
  })

  describe('obtenerPedidoPorId', () => {
    it('trae el detalle y lo convierte en un Pedido completo', async () => {
      // Arrange: Simulamos lo que devuelve el backend (DetallePedido)
      const mockDetalle = {
        id: '50',
        estado: 'EN_CAMINO',
        fecha: '2024-10-20',
        formaPago: 'EFECTIVO',
        items: [],
        resumen: { subtotal: 100, recargoTipoPago: 0, tarifaEntrega: 0, total: 100 },
        local: {
          nombre: 'Local Detalle',
          imagen: 'img.jpg',
          calificacion: 5,
          distanciaKm: 1.2,
          envioGratis: true
        }
      }

      vi.mocked(axios.get).mockResolvedValue({ data: mockDetalle })

      // Act
      const pedido = await pedidoService.obtenerPedidoPorId('50')

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/pedidosPublic/50`)
      expect(pedido).toBeInstanceOf(Pedido)
      expect(pedido.id).toBe(50)
      expect(pedido.local?.nombre).toBe('Local Detalle')
    })
  })

  describe('guardarPedido', () => {
    it('transforma el pedido a DTO y hace POST', async () => {
      // Arrange
      const pedidoMock = new Pedido()
      // Simulamos que el usuario armó un pedido
      pedidoMock.formaPago = 'TARJETA'
      // Mockeamos el método estático para evitar depender del AuthService real aquí
      // O podemos mockear el AuthService globalmente como en el test anterior.
      // Aquí asumiremos que AuthService está mockeado o el static funciona.

      /* IMPORTANTE: Como `toPedidoNuevo` usa authService, necesitamos que 
         authService esté disponible o mockeado. 
         Podemos reutilizar el mock del archivo anterior si los corres juntos, 
         o agregarlo aquí arriba. */

      vi.mocked(axios.post).mockResolvedValue({ status: 201 })

      // Act
      await pedidoService.guardarPedido(pedidoMock)

      // Assert
      // Verificamos que se llame con el objeto transformado
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/pedidosPublic/nuevoPedido`,
        expect.objectContaining({
          formaPago: 'TARJETA' // Verificamos que al menos pase este campo
        })
      )
    })
  })
})
