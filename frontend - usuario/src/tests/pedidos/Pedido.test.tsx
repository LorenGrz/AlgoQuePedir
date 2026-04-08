// src/tests/models/Pedido.test.ts
import { describe, it, expect, vi } from 'vitest'
import { Pedido } from '../../classes/Pedido' // Ajusta la ruta según tu estructura
import type { Plato } from '../../models/platoModel'
import type { LocalCompleto } from '../../models/localModels'

// Mockeamos el authService porque se usa en el método estático toPedidoNuevo
vi.mock('../../services/AuthService', () => ({
  authService: {
    obtenerIdUsuarioActual: vi.fn().mockReturnValue(1)
  }
}))

// --- DATOS DE PRUEBA ---
const platoMock: Plato = {
  id: 1,
  nombre: 'Milanesa',
  descripcion: 'Rica',
  precio: 1000,
  img: 'img.jpg',
  popular: true
}

const localMock: LocalCompleto = {
  id: 1,
  nombre: 'El Club de la Milanesa',
  img: 'logo.jpg',
  puntajeTotal: 4.5,
  totalVentas: 100,
  resenas: [],
  distanciaKm: 2.5,
  envioGratis: true, // Importante para tests de envío
  metodosDePago: ['EFECTIVO', 'TARJETA']
}

describe('Clase Pedido (Dominio)', () => {
  describe('Cálculo de Totales y Resumen', () => {
    it('calcula correctamente el subtotal al agregar items', () => {
      const pedido = new Pedido(localMock)

      // Agregamos 2 milanesas (1000 c/u)
      const pedidoActualizado = pedido.agregarItem(platoMock, 2)

      expect(pedidoActualizado.resumen.subtotal).toBe(2000)
      expect(pedidoActualizado.totalItems()).toBe(2)
    })

    it('suma tarifa de entrega si el local NO tiene envío gratis', () => {
      const localPago = { ...localMock, envioGratis: false }
      const pedido = new Pedido(localPago)

      // 1 ítem de 1000 + 2000 de envío
      const pedidoActualizado = pedido.agregarItem(platoMock, 1)

      expect(pedidoActualizado.resumen.tarifaEntrega).toBe(2000)
      expect(pedidoActualizado.resumen.total).toBe(3000) // 1000 + 2000
    })

    it('aplica recargo del 5% si paga con TARJETA', () => {
      const pedido = new Pedido(localMock)
      // Agregamos ítem de 1000 pesos
      let pedidoActualizado = pedido.agregarItem(platoMock, 1)

      // Cambiamos a Tarjeta
      pedidoActualizado = pedidoActualizado.cambiarFormaPago('TARJETA')

      // Recargo esperado: 1000 * 0.05 = 50
      expect(pedidoActualizado.resumen.recargoTipoPago).toBe(50)
      expect(pedidoActualizado.total).toBe(1050)
    })

    it('aplica recargo del 5% si paga con QR', () => {
      const pedido = new Pedido(localMock)
      let pedidoActualizado = pedido.agregarItem(platoMock, 1)

      pedidoActualizado = pedidoActualizado.cambiarFormaPago('QR')

      expect(pedidoActualizado.resumen.recargoTipoPago).toBe(50)
    })

    it('NO aplica recargo si paga con EFECTIVO', () => {
      const pedido = new Pedido(localMock)
      let pedidoActualizado = pedido.agregarItem(platoMock, 1)

      // Por defecto es efectivo, pero forzamos el cambio para testear
      pedidoActualizado = pedidoActualizado.cambiarFormaPago('EFECTIVO')

      expect(pedidoActualizado.resumen.recargoTipoPago).toBe(0)
      expect(pedidoActualizado.total).toBe(1000)
    })
  })

  describe('Gestión de Items', () => {
    it('elimina el ítem si la cantidad es 0', () => {
      const pedido = new Pedido(localMock)
      let pedidoActualizado = pedido.agregarItem(platoMock, 2)

      // Act: agregamos el mismo plato con cantidad 0
      pedidoActualizado = pedidoActualizado.agregarItem(platoMock, 0)

      expect(pedidoActualizado.items).toHaveLength(0)
      expect(pedidoActualizado.resumen.subtotal).toBe(0)
    })

    it('quita un ítem por ID correctamente', () => {
      const pedido = new Pedido(localMock)
      let pedidoActualizado = pedido.agregarItem(platoMock, 1)

      pedidoActualizado = pedidoActualizado.quitarItem(+platoMock.id)

      expect(pedidoActualizado.items).toHaveLength(0)
    })
  })

  describe('Lógica de Local y Métodos de Pago', () => {
    it('resetea el método de pago si el nuevo local no soporta el actual', () => {
      // Arrancamos con un pedido en QR
      const pedido = new Pedido({ ...localMock, metodosDePago: ['QR'] })
      pedido.formaPago = 'QR'

      // Cambiamos a un local que SOLO acepta Efectivo
      const nuevoLocal = { ...localMock, metodosDePago: ['EFECTIVO'] }

      const pedidoActualizado = pedido.agregarLocal(nuevoLocal)

      // Debería haberse cambiado automáticamente a 'EFECTIVO' (el primero de la lista del nuevo local)
      expect(pedidoActualizado.formaPago).toBe('EFECTIVO')
    })
  })

  describe('Mappers Estáticos', () => {
    it('toPedidoNuevo crea el DTO correctamente con el ID del usuario', () => {
      const pedido = new Pedido(localMock)
      pedido.formaPago = 'EFECTIVO'

      const dto = Pedido.toPedidoNuevo(pedido)

      expect(dto.idCliente).toBe(1) // Viene del mock de authService
      expect(dto.idLocal).toBe(1)
      expect(dto.formaPago).toBe('EFECTIVO')
    })
  })
})
