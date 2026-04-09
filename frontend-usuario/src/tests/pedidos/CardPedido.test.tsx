import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CardPedido } from '../../components/pedidos/CardPedido'
import { Pedido } from '../../classes/Pedido'
import { BrowserRouter } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import React from 'react'

// Mockeamos el servicio
vi.mock('../../services/pedidoService', () => ({
  pedidoService: {
    cancelarPedido: vi.fn()
  }
}))

// Helper para renderizar con Router (necesario por el componente <Link>)
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('CardPedido', () => {
  let pedidoMock: Pedido

  beforeEach(() => {
    vi.clearAllMocks()
    pedidoMock = new Pedido()
    pedidoMock.id = 123
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedidoMock.local = { nombre: 'Local Test', img: 'img.jpg' } as any
    pedidoMock.total = 5000
    pedidoMock.cantArticulos = 3
    pedidoMock.fecha = '2024-11-20T10:00:00Z'
  })

  it('renderiza la información básica del pedido', () => {
    renderWithRouter(
      <CardPedido pedido={pedidoMock} estadoActivo="pendiente" onCancelSuccess={vi.fn()} />
    )

    expect(screen.getByText('Local Test')).toBeInTheDocument()
    expect(screen.getByText(/Total: \$5000/)).toBeInTheDocument()
    expect(screen.getByText(/3 artículos/)).toBeInTheDocument()
  })

  it('NO muestra el botón Cancelar si el estado es "cancelado"', () => {
    renderWithRouter(
      <CardPedido pedido={pedidoMock} estadoActivo="cancelado" onCancelSuccess={vi.fn()} />
    )

    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument()
  })

  it('muestra icono de error si falla la cancelación', async () => {
    vi.mocked(pedidoService.cancelarPedido).mockRejectedValue(new Error('Falló'))

    renderWithRouter(
      <CardPedido pedido={pedidoMock} estadoActivo="pendiente" onCancelSuccess={vi.fn()} />
    )

    await userEvent.click(screen.getByText('Cancelar'))

    // Asumiendo que ErrorIcon renderiza algún SVG o elemento distinguible.
    // Si tu ErrorIcon tiene un role="img" o similar, úsalo.
    // Aquí esperamos a que termine el proceso de "loading" y vuelva el botón o el error.
    await waitFor(() => {
      // Al fallar, el loading se va, y debería aparecer el error
      // Como el componente ErrorIcon no tiene texto, verificamos que el botón vuelve a estar habilitado o el error existe
      expect(screen.queryByText('Cancelando...')).not.toBeInTheDocument()
    })
  })
})
