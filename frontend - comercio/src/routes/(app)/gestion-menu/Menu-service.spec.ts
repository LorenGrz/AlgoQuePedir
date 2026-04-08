import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { Plato } from '$lib/components/classes/Plato.svelte'
import { menuService } from './Menu-service'
import { API_URL } from '$lib/components/services/Variables-entorno'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
}

describe('menuService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe llamar a GET /menu y devolver instancias de Plato', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          nombre: 'Milanesa con puré',
          descripcion: 'Clásico plato argentino',
          precio: 2500,
          img: '/mila.jpg'
        },
        {
          id: 2,
          nombre: 'Pizza Napolitana',
          descripcion: 'Con tomate y mozzarella',
          precio: 3000,
          img: '/pizza.jpg'
        }
      ]
    })

    const platos = await menuService.obtenerPlatos()

    // Verifico que axios haya llamado al back correctamente
    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL + '/menu')

    // Verifica que devolvió 2 objetos
    expect(platos).toHaveLength(2)

    // Verifico que sean instancias de Plato
    platos.forEach(p => expect(p).toBeInstanceOf(Plato))

    // Verifico que el objeto de dominio se construya correctamente
    expect(platos[0].imgUrl).toBe('/mila.jpg')
    expect(platos[1].imgUrl).toBe('/pizza.jpg')
  })
})
