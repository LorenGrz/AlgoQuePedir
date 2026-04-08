import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { authService, type UsuarioRequest } from '../../utils/Login-service'
import { API_URL } from '$lib/components/services/Variables-entorno'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>
}

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe llamar al back en /auth/login y devolver el localId', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: {
        id: 1
      }
    })

    const usuarioRequest: UsuarioRequest = {
      username: 'pizzeriaSanti',
      password: '123'
    }

    const response = await authService.login(usuarioRequest)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/login`,
      usuarioRequest
    )

    expect(response.id).toBe(1)
  })

  it('debe llamar al back en /auth/register y devolver el localId', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: {
        id: 2
      }
    })

    const usuarioRequest: UsuarioRequest = {
      username: 'nuevoUsuario',
      password: '123'
    }

    const response = await authService.register(usuarioRequest)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/register`,
      usuarioRequest
    )
    expect(response.id).toBe(2)
  })

  it('debe lanzar error cuando el backend falla (login)', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'Usuario no encontrado' }
      }
    })

    const usuarioRequest: UsuarioRequest = {
      username: 'usuarioInexistente',
      password: '123'
    }

    await expect(authService.login(usuarioRequest)).rejects.toMatchObject({
      response: {
        status: 404,
        data: { message: 'Usuario no encontrado' }
      }
    })
  })

  it('debe lanzar error cuando el backend falla (register)', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'Usuario ya registrado' }
      }
    })

    const usuarioRequest: UsuarioRequest = {
      username: 'usuarioExistente',
      password: '123'
    }

    await expect(authService.register(usuarioRequest)).rejects.toMatchObject({
      response: {
        status: 404,
        data: { message: 'Usuario ya registrado' }
      }
    })
  })
})