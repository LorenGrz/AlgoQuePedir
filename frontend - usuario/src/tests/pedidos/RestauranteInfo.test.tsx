import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RestauranteInfo } from '../../components/pedidos/RestauranteInfo'
import { Pedido } from '../../classes/Pedido'

describe('RestauranteInfo', () => {
  it('no renderiza nada si el pedido no tiene local', () => {
    const pedido = new Pedido()
    pedido.local = null
    const { container } = render(<RestauranteInfo pedido={pedido} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza la información del local correctamente', () => {
    const pedido = new Pedido()
    pedido.local = {
      nombre: 'Burger King',
      img: 'logo.png',
      puntajeTotal: 4.8,
      distanciaKm: 1.5,
      envioGratis: true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    render(<RestauranteInfo pedido={pedido} />)

    expect(screen.getByText('Burger King')).toBeInTheDocument()
    expect(screen.getByText(/4.8/)).toBeInTheDocument()
    expect(screen.getByText(/Envío gratis/)).toBeInTheDocument()
  })

  it('muestra "Con envío" si envioGratis es false', () => {
    const pedido = new Pedido()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedido.local = { nombre: 'X', envioGratis: false } as any
    render(<RestauranteInfo pedido={pedido} />)
    expect(screen.getByText(/Con envío/)).toBeInTheDocument()
  })
})
