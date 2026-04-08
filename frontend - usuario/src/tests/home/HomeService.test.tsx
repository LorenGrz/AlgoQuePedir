import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { homeService } from '../../services/homeService'
import { authService } from '../../services/AuthService'
import type { CardHome } from '../../models/localModels'

// axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// authServic
vi.mock('../../services/AuthService', () => ({
  authService: {
    obtenerIdUsuarioActual: vi.fn()
  }
}))

// datos de prueba
const LOCALES_MOCK: CardHome[] = [
  {
    id: 1,
    nombre: 'Pizza Palace',
    direccion: 'Av. Corrientes',
    altura: 1234,
    img: 'https://example.com/pizza.jpg',
    cercano: true
  },
  {
    id: 2,
    nombre: 'Burger King',
    direccion: 'Av. Santa Fe',
    altura: 2500,
    img: 'https://example.com/burger.jpg',
    cercano: false
  }
]

describe('HomeService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // userId del localStorage
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(1)
  })

  /* getAll */
  it('getAll ok', async () => {
    mockedAxios.get.mockResolvedValue({ data: LOCALES_MOCK })

    const result = await homeService.getAll()

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/local/locales/1'))
    expect(result).toEqual(LOCALES_MOCK)
    expect(authService.obtenerIdUsuarioActual).toHaveBeenCalledTimes(1)
  })

  it('getAll usuario no autenticado', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(null)

    await expect(homeService.getAll()).rejects.toThrow()
  })

  /* getFiltered */
  it('getFiltered ok', async () => {
    mockedAxios.get.mockResolvedValue({ data: [LOCALES_MOCK[0]] })

    const result = await homeService.getFiltered('pizza', false)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/local/1/search'),
      { params: { search: 'pizza', onlyNearby: false } }
    )
    expect(result).toEqual([LOCALES_MOCK[0]])
    expect(authService.obtenerIdUsuarioActual).toHaveBeenCalledTimes(1)
  })

  it('getFiltered para cercanos', async () => {
    const localesCercanos = LOCALES_MOCK.filter(local => local.cercano)
    mockedAxios.get.mockResolvedValue({ data: localesCercanos })

    const result = await homeService.getFiltered('', true)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/local/1/search'),
      { params: { search: '', onlyNearby: true } }
    )
    expect(result).toEqual(localesCercanos)
  })

  it('getFiltered sin resultados', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })

    const result = await homeService.getFiltered('sushi', false)

    expect(result).toEqual([])
  })

  it('getFiltered - usuario no autenticado', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(null)

    await expect(homeService.getFiltered('pizza', false)).rejects.toThrow()
  })
})