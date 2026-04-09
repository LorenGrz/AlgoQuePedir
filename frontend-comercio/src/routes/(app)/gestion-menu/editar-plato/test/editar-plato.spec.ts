import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tick } from 'svelte'

vi.mock('$app/navigation', () => ({ goto: vi.fn() }))
vi.mock('$lib/assets/images/no-image.png', () => ({ default: '/mock.png' }))
vi.mock('$lib/assets/icons/warning.svg', () => ({ default: '/warn.svg' }))
vi.mock('$lib/components/services/Plato-service', () => ({
  platoService: { obtenerPlato: vi.fn() }
}))
// mockear @sveltejs/kit.error para que tire un error testeable
vi.mock('@sveltejs/kit', () => ({
  error: (status: number, message: string) => {
    const e: any = new Error(message)
    e.status = status
    throw e
  }
}))

import PlatoPage from '../+page.svelte'
import { goto } from '$app/navigation'
import { platoService } from '$lib/components/services/Plato-service'
import { load } from '../[id]/+page'
import type { PageLoad } from '../[id]/$types'
import { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'


const ingredientesMock = new Ingrediente( {
  id: '6',
  nombre: "Lechuga",
  grupoAlimenticio: "FRUTAS_Y_VERDURAS",
  origenAnimal: false,
  costo: 20.0
})

describe('Editar plato', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    localStorage.setItem('localId', '1')
  })
  
  type loadType = Parameters<PageLoad>[0]
  const resEvent = (id: string) =>
    ({ params: { id } } as loadType)
  
  it('load de editar plato - error 404: no encontro el id', async () => {
    // esto devuelve axios ante un 404
    // ;(platoService.obtenerPlato as any).mockRejectedValue({
    (platoService.obtenerPlato as any).mockRejectedValue({
      response: {
        status: 404,
        data: {
          status: 404,
          error: 'Not Found',
          message: 'No se encontró el objeto con ID 30.',
          path: '/menu/plato/30'
        }
      }
    })

    await expect(load(resEvent('30'))).rejects.toMatchObject({
      status: 404,
      message: 'No se encontró el objeto con ID 30.'
    })
  })
  
  it('click en "Descartar Cambios" navega al menu', async () => {
    render(PlatoPage, {props: {data: { ingrediente: ingredientesMock }}})
    const botonVolver = screen.getByText('Descartar Cambios')
    await userEvent.click(botonVolver)

    expect(goto).toHaveBeenCalledWith('/gestion-menu')
  })

  it('nuevo plato: formulario invalido', async () => {
    render(PlatoPage, {props: {data: { ingrediente: ingredientesMock }}})
    const botonGuardar = screen.getByText('Guardar Cambios')
    await userEvent.click(botonGuardar)
    await tick()
  
    expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0)
    expect(screen.getByText('Debe ser un entero positivo')).toBeInTheDocument()
  })
})
