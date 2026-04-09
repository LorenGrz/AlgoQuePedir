import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { localService } from '../../services/localService'
import type { LocalCompleto } from '../../models/localModels'
import type { Plato } from '../../models/platoModel'

// mock de axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const LOCAL_MOCK: LocalCompleto = {
  id: 4,
  nombre: 'Restaurante Italiano',
  puntajeTotal: 4.5,
  totalVentas: 546,
  resenas: [],
  img: 'x',
  distanciaKm: 10,
  envioGratis: true,
  metodosDePago: ['EFECTIVO', 'QR']
}

const PLATOS_MOCK: Plato[] = [
  { id: 1, nombre: 'Pizza', precio: 10, img: 'p', descripcion: 'desc', popular: true },
  { id: 2, nombre: 'Hamburguesa', precio: 12, img: 'h', descripcion: 'desc', popular: false }
]

describe('LocalService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  /* getLocal() */
  it('getLocal - happy path', async () => {
    mockedAxios.get.mockResolvedValue({ data: LOCAL_MOCK })

    const result = await localService.getLocal(4)

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/localpublico/4'))
    expect(result).toEqual(LOCAL_MOCK)
  })

  it('getLocal - sad path', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error())

    await expect(localService.getLocal(4)).rejects.toThrow()
  })

  /* getPlatosLocal() */
  it('getPlatosLocal - happy path', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: PLATOS_MOCK })

    const result = await localService.getPlatosLocal(4)

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/localpublico/4/menu'))
    expect(result).toEqual(PLATOS_MOCK)
  })

  it('getPlatosLocal - sad path', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error())

    await expect(localService.getPlatosLocal(4)).rejects.toThrow()
  })
})
