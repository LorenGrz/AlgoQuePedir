import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ingredienteService } from '$lib/components/services/Ingrediente-service'
import { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'
import axios from 'axios'
import { API_URL } from '$lib/components/services/Variables-entorno'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

describe('ingredienteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('OBTIENE INGREDIENTE POR ID CORRECTAMENTE', async () => {
    const mockIngrediente = {
      id: '1',
      nombre: 'Lechuga',
      grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
      origenAnimal: false,
      costo: 150
    }
    
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockIngrediente })
    
    const resultado = await ingredienteService.obtenerPorId('1')
    
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/ingrediente/1`)
    expect(resultado).toEqual(mockIngrediente)
  })

  it('CREA INGREDIENTE CORRECTAMENTE', async () => {
    const ingrediente = new Ingrediente()
    ingrediente.nombre = 'Tomate'
    ingrediente.grupoAlimenticio = 'FRUTAS_Y_VERDURAS'
    ingrediente.costo = 200
    
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { id: '2' } })
    
    await ingredienteService.crear(ingrediente)
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/ingrediente`,
      expect.objectContaining({
        nombre: 'Tomate',
        grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
        costo: 200
      })
    )
  })

  it('ACTUALIZA INGREDIENTE CORRECTAMENTE', async () => {
    const ingrediente = new Ingrediente()
    ingrediente.id = '1'
    ingrediente.nombre = 'Tomate Actualizado'
    ingrediente.grupoAlimenticio = 'FRUTAS_Y_VERDURAS'
    ingrediente.costo = 250
    
    mockedAxios.put = vi.fn().mockResolvedValue({ data: {} })
    
    await ingredienteService.actualizar(ingrediente)
    
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${API_URL}/ingrediente`,
      expect.objectContaining({
        id: '1',
        nombre: 'Tomate Actualizado',
        costo: 250
      })
    )
  })
})