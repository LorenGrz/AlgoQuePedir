import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResumenPedidoSection } from '../../components/pedidos/ResumenPedido'
import { Pedido } from '../../classes/Pedido'

describe('ResumenPedidoSection', () => {
  it('renderiza correctamente los montos del resumen', () => {
    const pedido = new Pedido()
    pedido.resumen = {
      subtotal: 1000,
      recargoTipoPago: 50,
      tarifaEntrega: 200,
      total: 1250
    }

    render(<ResumenPedidoSection pedido={pedido} />)

    // Buscamos texto y valor
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('$1000.00')).toBeInTheDocument()

    expect(screen.getByText('Recargo por tipo de pago')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('$1250.00')).toBeInTheDocument()
  })

  it('no renderiza nada si pedido.resumen es null', () => {
    const pedido = new Pedido()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedido.resumen = null as any

    const { container } = render(<ResumenPedidoSection pedido={pedido} />)
    expect(container).toBeEmptyDOMElement()
  })
})
