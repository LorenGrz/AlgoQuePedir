import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DetallePedidos } from '../../pages/DetallePedidos'
import { pedidoService } from '../../services/pedidoService'
import { authService } from '../../services/AuthService'
import { BrowserRouter } from 'react-router-dom'
import { Pedido } from '../../classes/Pedido'

// Mock de servicios
vi.mock('../../services/pedidoService')
vi.mock('../../services/AuthService')

const navigateSpy = vi.fn()

// Mock de router para manipular useParams y useNavigate
vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateSpy,
    useParams: vi.fn().mockReturnValue({ estado: 'pendiente' }) // Valor por defecto
  }
})

// Helper para renderizar
const renderView = () =>
  render(
    <BrowserRouter>
      <DetallePedidos />
    </BrowserRouter>
  )

describe('DetallePedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authService.estaAutenticado).mockReturnValue(true)
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(1)
  })

  it('carga los pedidos pendientes al iniciar', async () => {
    const pedidosMock = [
      Object.assign(new Pedido(), { id: 1, local: { nombre: 'Local A' }, total: 100 })
    ]
    vi.mocked(pedidoService.obtenerPedidosPorEstado).mockResolvedValue(pedidosMock)

    renderView()

    await waitFor(() => {
      expect(screen.getByText('Local A')).toBeInTheDocument()
    })
    expect(pedidoService.obtenerPedidosPorEstado).toHaveBeenCalledWith(1, 'pendiente')
  })

  it('muestra mensaje cuando no hay pedidos', async () => {
    vi.mocked(pedidoService.obtenerPedidosPorEstado).mockResolvedValue([])

    renderView()

    await waitFor(() => {
      expect(screen.getByText(/No hay pedidos pendientes/i)).toBeInTheDocument()
    })
  })

  it('cambia de pestaña y hace fetch de nuevo estado', async () => {
    vi.mocked(pedidoService.obtenerPedidosPorEstado).mockResolvedValue([])

    renderView()

    const tabCompletados = await screen.findByText('Completados')

    await userEvent.click(tabCompletados)

    expect(navigateSpy).toHaveBeenCalledWith('/detalle-pedidos/estado/entregado')
    expect(pedidoService.obtenerPedidosPorEstado).toHaveBeenCalledWith(1, 'entregado')
  })

  it('muestra error si el servicio falla', async () => {
    vi.mocked(pedidoService.obtenerPedidosPorEstado).mockRejectedValue(new Error('Fallo de red'))

    renderView()

    await waitFor(() => {
      expect(screen.getByText('Fallo de red')).toBeInTheDocument()
    })
  })
})
