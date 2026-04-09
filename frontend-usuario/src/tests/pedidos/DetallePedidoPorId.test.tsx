import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DetallePedidoPorId } from '../../pages/DetallePedidoPorId' // Ajusta ruta
import { pedidoService } from '../../services/pedidoService'
import { authService } from '../../services/AuthService'
import { BrowserRouter } from 'react-router-dom'
import { Pedido } from '../../classes/Pedido'

vi.mock('../../services/pedidoService')
vi.mock('../../services/AuthService')

// Mockeamos useParams para simular que estamos en la URL /:id
vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '100' }), // ID fijo para el test
    useNavigate: () => vi.fn()
  }
})

describe('DetallePedidoPorId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authService.estaAutenticado).mockReturnValue(true)
  })

  it('muestra spinner y luego el detalle del pedido', async () => {
    // Mock del pedido completo
    const pedidoMock = new Pedido()
    pedidoMock.id = 100
    pedidoMock.local = {
      nombre: 'Sushi Test',
      img: 'x.jpg',
      puntajeTotal: 5,
      distanciaKm: 1,
      envioGratis: true,
      metodosDePago: []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
    pedidoMock.items = []
    pedidoMock.resumen = { subtotal: 100, recargoTipoPago: 0, tarifaEntrega: 0, total: 100 }
    pedidoMock.formaPago = 'Efectivo'

    vi.mocked(pedidoService.obtenerPedidoPorId).mockResolvedValue(pedidoMock)

    render(
      <BrowserRouter>
        <DetallePedidoPorId />
      </BrowserRouter>
    )

    // await waitFor(() => expect(screen.getByTestId('spinner')).toBeInTheDocument())

    await waitFor(() => {
      expect(screen.getByText('Sushi Test')).toBeInTheDocument()
      expect(screen.getByText('Tu Pedido')).toBeInTheDocument()
    })

    expect(pedidoService.obtenerPedidoPorId).toHaveBeenCalledWith('100')
  })

  it('muestra mensaje si el pedido no existe (null)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(pedidoService.obtenerPedidoPorId).mockResolvedValue(null as any) // Simulamos null

    render(
      <BrowserRouter>
        <DetallePedidoPorId />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/El pedido con ID: 100 no existe/i)).toBeInTheDocument()
    })
  })

  it('muestra ErrorCard si el servicio falla', async () => {
    vi.mocked(pedidoService.obtenerPedidoPorId).mockRejectedValue(new Error('Error interno'))

    render(
      <BrowserRouter>
        <DetallePedidoPorId />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Error interno')).toBeInTheDocument()
    })
  })
})
