vi.mock('../../utils/hooks', () => ({
  useOnInit: (fn: () => void) => fn()
}))

import { render, screen } from '@testing-library/react'
import { ModalPlato } from '../../components/local/ModalPlato'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Pedido } from '../../classes/Pedido'
import userEvent from '@testing-library/user-event'
import type { Plato } from '../../models/platoModel'

const PLATO: Plato = {
  id: 1,
  nombre: 'Pizza Margherita',
  descripcion: 'Riquísima pizza',
  img: 'pizza.png',
  precio: 10,
  popular: true
}

const pedido = new Pedido() // vacio

describe('ModalPlato', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renderiza la info básica del plato con cantidad 0 si el plato no está en el pedido', () => {
    render(<ModalPlato plato={PLATO} pedido={pedido} setPedido={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('incrementa y decrementa la cantidad', async () => {
    render(<ModalPlato plato={PLATO} pedido={new Pedido()} setPedido={vi.fn()} onClose={vi.fn()} />)

    const mas = screen.getByText('+')
    const menos = screen.getByText('-')

    await userEvent.click(mas)
    expect(screen.getByText('1')).toBeInTheDocument()

    await userEvent.click(menos)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('no permite cantidad menor a 0', async () => {
    render(<ModalPlato plato={PLATO} pedido={new Pedido()} setPedido={vi.fn()} onClose={vi.fn()} />)

    const menos = screen.getByText('-')

    await userEvent.click(menos)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('actualiza el precio total al cambiar cantidad', async () => {
    render(<ModalPlato plato={PLATO} pedido={new Pedido()} setPedido={vi.fn()} onClose={vi.fn()} />)

    const mas = screen.getByText('+')

    await userEvent.click(mas)
    expect(screen.getByText('$10.00')).toBeInTheDocument()

    await userEvent.click(mas)
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  it('llama onClose al clickear el fondo', async () => {
    const onClose = vi.fn()

    render(<ModalPlato plato={PLATO} pedido={new Pedido()} setPedido={vi.fn()} onClose={onClose} />)

    await userEvent.click(screen.getByTestId('modal-sombra'))
    expect(onClose).toHaveBeenCalled()
  })

  it('agrega al pedido y cierra el modal', async () => {
    const setPedido = vi.fn()
    const onClose = vi.fn()

    render(
      <ModalPlato plato={PLATO} pedido={new Pedido()} setPedido={setPedido} onClose={onClose} />
    )

    await userEvent.click(screen.getByText('Agregar al Pedido'))

    expect(setPedido).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  /* it('arranca con la cantidad del pedido si ya estaba cargado', () => {
    const pedido = new Pedido(2)
    
    const pedidoNuevo = pedido.agregarItem(PLATO, 3 )
    render(<ModalPlato plato={PLATO} pedido={pedidoNuevo} setPedido={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  }) */
})
