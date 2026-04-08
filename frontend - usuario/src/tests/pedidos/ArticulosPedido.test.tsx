import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ArticulosPedido } from '../../components/pedidos/ArticulosPedido'
import { Pedido } from '../../classes/Pedido'

const itemsMock = [
  {
    plato: { id: 1, nombre: 'Pizza', precio: 100, descripcion: '', img: '', popular: true },
    cantidad: 2
  }
]

describe('ArticulosPedido', () => {
  it('renderiza la lista de artículos y calcula totales visuales', () => {
    const pedido = new Pedido(null, itemsMock)

    render(<ArticulosPedido pedido={pedido} />)

    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument()
    // 100 * 2 = 200
    expect(screen.getByText('$200.00')).toBeInTheDocument()
  })

  it('muestra el botón de quitar si el pedido es modificable (id null)', async () => {
    const onQuitarSpy = vi.fn()
    const pedido = new Pedido(null, itemsMock)

    render(<ArticulosPedido pedido={pedido} onQuitarItem={onQuitarSpy} />)

    const botonQuitar = screen.getByRole('button', { name: /Quitar/i })

    expect(botonQuitar).toBeInTheDocument()

    await userEvent.click(botonQuitar)
    expect(onQuitarSpy).toHaveBeenCalledWith(1) // El ID del plato mockeado (itemsMock[0].plato.id)
  })

  it('NO muestra el botón de quitar si el pedido ya tiene ID (no modificable)', () => {
    const pedido = new Pedido(null, itemsMock)
    pedido.id = 100

    render(<ArticulosPedido pedido={pedido} />)

    const botonQuitar = screen.queryByRole('button', { name: /Quitar ítem/i })
    expect(botonQuitar).not.toBeInTheDocument()
  })
})
