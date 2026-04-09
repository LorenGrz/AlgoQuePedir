import { render, screen, fireEvent } from '@testing-library/svelte'
import PerfilLocal from '../+page.svelte'
import { vi } from 'vitest'
import { Local } from '../utils/Local.svelte'
import { localService } from '../utils/Local-service'

/* si no mockeo el service,
el test falla porque tarda mas en
rechazar la promesa que en terminar
la ejecucion del test */

vi.mock('../utils/Local-service', () => ({
  localService: {
    actualizarLocal: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('PerfilLocal', () => {
  let local: Local

  beforeEach(() => {
    local = new Local()
    localStorage.setItem('localId', '4')
  })

  it('muestra errores cuando se intenta guardar con datos inválidos', async () => {
    render(PerfilLocal, { data: { local } })

    const botonGuardar = screen.getByText('Guardar Cambios')

    /* Simulo submit vacío */
    await fireEvent.click(botonGuardar)

    /* Espero detección de errores */
    expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0)
    expect(screen.getByText('Debe ser un entero positivo')).toBeInTheDocument()
    expect(screen.getByText('Elegí al menos un método de pago')).toBeInTheDocument()
    expect(screen.getByText('Longitud debe estar entre -180 y 180')).toBeInTheDocument() 
  })

  it('envía correctamente el formulario cuando los datos son válidos', async () => {
    render(PerfilLocal, { data: { local } })

    // Completo los campos del formulario
    await fireEvent.input(screen.getByTestId('nombre-local'), {
      target: { value: 'Bar La Esquina' }
    })
    await fireEvent.input(screen.getByTestId('direccion-local'), {
      target: { value: 'San Martín' }
    })
    await fireEvent.input(screen.getByTestId('altura-local'), {
      target: { value: '1234' }
    })
    await fireEvent.input(screen.getByTestId('latitud-local'), {
      target: { value: '-34.6' }
    })
    await fireEvent.input(screen.getByTestId('longitud-local'), {
      target: { value: '-58.4' }
    })
    await fireEvent.input(screen.getByTestId('porcentaje-local'), {
      target: { value: '10' }
    })
    await fireEvent.input(screen.getByTestId('porcentaje-autores-local'), {
      target: { value: '15' }
    })
    await fireEvent.click(screen.getByTestId('efectivo'))
    
    /* Simulo submit válido */
    const botonGuardar = screen.getByText('Guardar Cambios')
    await fireEvent.click(botonGuardar)

    const id = Number(localStorage.getItem('localId'))

    /* Espero que se ejecute el llamado al back */
    expect(localService.actualizarLocal).toHaveBeenCalledTimes(1)
    expect(localService.actualizarLocal).toHaveBeenCalledWith(expect.any(Local), id)
  })

  it('resetea errores al presionar "Descartar Cambios"', async () => {
    render(PerfilLocal, { data: { local } })

    const botonGuardar = screen.getByText('Guardar Cambios')
    await fireEvent.click(botonGuardar)

    expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0)
    
    const botonReset = screen.getByText('Descartar Cambios')
    await fireEvent.click(botonReset)
    
    expect(screen.queryByText('Requerido')).not.toBeInTheDocument()
  })
})
