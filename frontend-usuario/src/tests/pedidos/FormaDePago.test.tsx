import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FormaDePago } from '../../components/pedidos/FormaDePago'
import { Pedido } from '../../classes/Pedido'

describe('FormaDePago', () => {
  it('muestra un SELECT con opciones si el pedido es modificable', async () => {
    const pedido = new Pedido()
    // id null = modificable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedido.local = { metodosDePago: ['EFECTIVO', 'TARJETA'] } as any
    const onChangeSpy = vi.fn()

    render(<FormaDePago pedido={pedido} valorActual="EFECTIVO" onChangePago={onChangeSpy} />)

    const combobox = screen.getByRole('combobox', { name: /Forma de pago/i })
    expect(combobox).toBeInTheDocument()

    // Verificamos opciones
    expect(screen.getByRole('option', { name: 'EFECTIVO' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'TARJETA' })).toBeInTheDocument()

    // Probamos el cambio
    await userEvent.selectOptions(combobox, 'TARJETA')
    expect(onChangeSpy).toHaveBeenCalledWith('TARJETA')
  })

  it('muestra TEXTO plano si el pedido NO es modificable', () => {
    const pedido = new Pedido()
    pedido.id = 10 // id existe = no modificable

    render(<FormaDePago pedido={pedido} valorActual="EFECTIVO" />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText('EFECTIVO')).toBeInTheDocument()
  })

  it('usa "Efectivo" por defecto si el local no tiene métodos definidos', () => {
    const pedido = new Pedido()
    // local sin metodos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedido.local = { metodosDePago: [] } as any

    render(<FormaDePago pedido={pedido} valorActual="Efectivo" />)

    // Debería renderizar la opción default
    const opcion = screen.getByRole('option', { name: 'EFECTIVO' })
    expect(opcion).toBeInTheDocument()
  })
})
