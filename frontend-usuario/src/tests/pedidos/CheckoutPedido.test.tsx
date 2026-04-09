import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CheckoutPedido } from '../../pages/CheckoutPedido'
import { Pedido } from '../../classes/Pedido'
import { pedidoService } from '../../services/pedidoService'
import { authService } from '../../services/AuthService'
import { BrowserRouter } from 'react-router-dom'

// Mockeamos servicios
vi.mock('../../services/pedidoService')
vi.mock('../../services/AuthService')

// Mockeamos hooks de router, PERO mantenemos BrowserRouter para los Links
const navigateSpy = vi.fn()
const setPedidoSpy = vi.fn()

// Creamos una instancia real de Pedido para que tenga los métodos (calcularResumen, etc)
const pedidoMock = new Pedido()
pedidoMock.local = {
  id: 1,
  nombre: 'Local Test',
  img: 'img.jpg',
  metodosDePago: ['EFECTIVO']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
pedidoMock.items = [{ plato: { id: 1, nombre: 'Pizza', precio: 100 } as any, cantidad: 1 }]
pedidoMock.calcularResumen()

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateSpy,
    useOutletContext: () => ({
      pedido: pedidoMock,
      setPedido: setPedidoSpy
    })
  }
})

describe('CheckoutPedido', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authService.estaAutenticado).mockReturnValue(true)
  })

  it('renderiza correctamente los detalles del pedido y totales', () => {
    render(
      <BrowserRouter>
        <CheckoutPedido />
      </BrowserRouter>
    )

    expect(screen.getByText('Tu Pedido')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Local Test')).toBeInTheDocument()
    expect(screen.getByText('Confirmar pedido')).toBeInTheDocument()
  })

  it('redirige al login si no está autenticado', () => {
    vi.mocked(authService.estaAutenticado).mockReturnValue(false)

    render(
      <BrowserRouter>
        <CheckoutPedido />
      </BrowserRouter>
    )

    expect(navigateSpy).toHaveBeenCalledWith('/auth/login')
  })

  it('llama a guardarPedido y navega al éxito cuando se confirma', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(pedidoService.guardarPedido).mockResolvedValue({} as any)

    render(
      <BrowserRouter>
        <CheckoutPedido />
      </BrowserRouter>
    )

    const btnConfirmar = screen.getByText('Confirmar pedido')
    await userEvent.click(btnConfirmar)

    expect(pedidoService.guardarPedido).toHaveBeenCalled()
    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith('/detalle-pedidos/estado/pendiente')
    })
  })

  it('limpiar carrito resetea el pedido y vuelve atrás', async () => {
    render(
      <BrowserRouter>
        <CheckoutPedido />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByText('Limpiar carrito de compras'))

    // Verificamos que se llamó a setPedido con un pedido nuevo (vacío)
    expect(setPedidoSpy).toHaveBeenCalled()
    expect(navigateSpy).toHaveBeenCalledWith(-1)
  })
})
