import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { Plato } from '$lib/components/classes/Plato.svelte'
import { platoService } from '$lib/components/services/Plato-service'
import { API_URL } from '$lib/components/services/Variables-entorno'
import { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
}

const ingredientesMock = new Ingrediente( {
  id: '6',
  nombre: "Lechuga",
  grupoAlimenticio: "FRUTAS_Y_VERDURAS",
  origenAnimal: false,
  costo: 20.0
})

const platoJSONMock = {
  id: '4',
  nombre: "Hamburguesa con Queso",
  descripcion: "Hamburguesa clásica con queso y papas fritas",
  precioBase: 3200.0,
  imgUrl: "http://localhost:9000/img/hamburga.jpg",
  autor: true,
  porcentajeDescuento: 0.0,
  ingredientes: [ingredientesMock]
}
const platoMock = new Plato({
  id: '4',
  toJson: vi.fn().mockReturnValue(platoJSONMock)
})

describe('Plato Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('localId', '1')
  })

  it('obtener plato - status 200: devuelve un plato ya existente', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: platoJSONMock, status: 200 })
    const plato = await platoService.obtenerPlato('4')

    expect(plato.nombre).toBe('Hamburguesa con Queso')
    expect(plato.ingredientes.length).toEqual(1)
  })

  it('editar plato (PUT) - status 200', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { ok: true } })

    const localId = localStorage.getItem('localId') ?? '1'
    const res = await platoService.editarPlato(platoMock, localId)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      API_URL + '/menu/plato/4',
      { plato: platoJSONMock, localId }
    )
    expect(res).toEqual({ ok: true })
  })

  it('neuvo plato (POST) - status 200', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } })

    const localId = localStorage.getItem('localId') ?? '1'
    const res = await platoService.crearPlato(platoMock, localId)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      API_URL + '/menu/plato',
      { plato: platoJSONMock, localId }
    )
    expect(res).toEqual({ ok: true })
  })
})
