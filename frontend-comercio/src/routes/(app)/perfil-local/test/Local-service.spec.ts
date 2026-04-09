import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { localService } from '../utils/Local-service'
import { Local } from '../utils/Local.svelte'
import { API_URL } from '$lib/components/services/Variables-entorno'

/* mockeo axios y le indico a
typescript que axios.get y axios.put
no son fn() si no que son vi.fn(),
(funciones mock de vitest)
lo que otorga funcionalidades como mockResolvedValue() */

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
}

describe('localService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('localId', '4')
  })

  it('debe llamar al back y adaptar el JSON a objeto de dominio', async () => {
    /* mockeo la respuesta del backend */
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: {
        nombre: 'Bar Cheto',
        url: 'https://barcheto.com',
        direccion: 'Av Siempre Cheta',
        altura: 1410,
        latitud: -34.6,
        longitud: -58.4,
        porcentajeApp: 90,
        porcentajeComision: 10,
        metodos: { efectivo: true, qr: false, transferencia: true }
      }
    })
    const id = Number(localStorage.getItem('localId'))
    const local = await localService.obtenerLocal(id)

    /* espero que el llamado al back se ejecute con la url correcta */
    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL + '/local/' + id)

    /* espero que el service realice la conversion a objeto de dominio correctamente */
    expect(local.nombre).toBe('Bar Cheto')
    expect(local.metodos.efectivo).toBe(true)
    expect(local.altura).toBe(1410)
  })

  it('debe hacer PUT al back con el objeto de dominio traducido a JSON', async () => {
    const local = new Local()

    local.nombre = 'Bar Piola'
    local.direccion = 'Calle Piola'
    local.altura = 1587
    local.latitud = -34.5
    local.longitud = -58.5
    local.porcentajeApp = 10
    local.porcentajeComision = 15
    local.metodos = { efectivo: true, qr: false, transferencia: true }

    const id = Number(localStorage.getItem('localId'))

    await localService.actualizarLocal(local, id)

    /* espero que el service realice la conversion a JSON correctamente */
    expect(mockedAxios.put).toHaveBeenCalledWith(
      API_URL + '/local/' + id,
      expect.objectContaining({
        nombre: 'Bar Piola',
        direccion: 'Calle Piola',
        porcentajeApp: 10
      })
    )
  })
})
