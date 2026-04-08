import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { calificacionesService } from '../../services/calificacionesService'
import type { LocalResumen } from '../../models/localModels'
import type { CalificacionResponse, LocalAcalificarRequest } from '../../models/CalificacionModel'

// mock de axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const LOCALES_PENDIENTES_MOCK: LocalResumen[] = [
  {
    id: 1,
    nombre: 'Restaurante Italiano',
    puntuacion: 4.5,
    tiempoMin: 30,
    tiempoMax: 45,
    imgUrl: 'italiano.jpg',
    direccion: {calle: '', altura: 0, ubicacion: ''}
  },
  {
    id: 2,
    nombre: 'Pizzería Napolitana',
    puntuacion: 4.8,
    tiempoMin: 25,
    tiempoMax: 40,
    imgUrl: 'pizzeria.jpg',
    direccion: {calle: '', altura: 0, ubicacion: ''}
  }
]

const CALIFICACION_RESPONSE_MOCK: CalificacionResponse = {
  ok: true,
  puntajePromedio: 4.5,
  mensaje: 'Calificación enviada exitosamente'
}

describe('CalificacionesService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  /* traerLocalesPendientes() */
  it('traerLocalesPendientes - happy path', async () => {
    mockedAxios.get.mockResolvedValue({ data: LOCALES_PENDIENTES_MOCK })

    const result = await calificacionesService.traerLocalesPendientes(123)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/calificaciones/123/pendientes')
    )
    expect(result).toEqual(LOCALES_PENDIENTES_MOCK)
    expect(result.length).toBe(2)
  })

  it('traerLocalesPendientes - sad path', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('404 Not Found'))

    await expect(calificacionesService.traerLocalesPendientes(123)).rejects.toThrow()
  })

  it('traerLocalesPendientes - retorna array vacío cuando no hay locales pendientes', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })

    const result = await calificacionesService.traerLocalesPendientes(123)

    expect(result).toEqual([])
    expect(result.length).toBe(0)
  })

  /* calificar() */
  it('calificar - happy path', async () => {
    mockedAxios.post.mockResolvedValue({ data: CALIFICACION_RESPONSE_MOCK })

    const payload: LocalAcalificarRequest = {
      localId: 1,
      puntuacion: 5,
      comentario: 'Excelente servicio'
    }

    const result = await calificacionesService.calificar(123, payload)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/calificaciones/123/calificar'),
      payload
    )
    expect(result).toEqual(CALIFICACION_RESPONSE_MOCK)
    expect(result.ok).toBe(true)
  })

  it('calificar - happy path sin comentario', async () => {
    mockedAxios.post.mockResolvedValue({ data: CALIFICACION_RESPONSE_MOCK })

    const payload: LocalAcalificarRequest = {
      localId: 1,
      puntuacion: 4
    }

    const result = await calificacionesService.calificar(123, payload)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/calificaciones/123/calificar'),
      payload
    )
    expect(result).toEqual(CALIFICACION_RESPONSE_MOCK)
  })

  it('calificar - sad path', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('400 Bad Request'))

    const payload: LocalAcalificarRequest = {
      localId: 1,
      puntuacion: 5
    }

    await expect(calificacionesService.calificar(123, payload)).rejects.toThrow()
  })

  it('calificar - retorna ok false cuando el backend indica error', async () => {
    const errorResponse: CalificacionResponse = {
      ok: false,
      puntajePromedio: 0,
      mensaje: 'No se pudo procesar la calificación'
    }
    mockedAxios.post.mockResolvedValue({ data: errorResponse })

    const payload: LocalAcalificarRequest = {
      localId: 1,
      puntuacion: 5
    }

    const result = await calificacionesService.calificar(123, payload)

    expect(result.ok).toBe(false)
    expect(result.mensaje).toBe('No se pudo procesar la calificación')
  })
})