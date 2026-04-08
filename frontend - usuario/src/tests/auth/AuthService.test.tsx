import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { authService } from '../../services/AuthService'
import type { AuthResponse } from '../../models/LoginModel'
import { usuarioService } from '../../services/usuarioService'
import { Usuario } from '../../classes/usuario/Usuario'

// mock de axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// mock de usuarioService
vi.mock('../../services/usuarioService', () => ({
  usuarioService: {
    getUsuario: vi.fn()
  }
}))

const AUTH_RESPONSE_MOCK: AuthResponse = {
  id: '123',
  username: 'testuser'
}

const USUARIO_MOCK = new Usuario({
  nombre: 'Test',
  apellido: 'User',
  direccion: 'Test Address',
  altura: 0,
  latitud: 0,
  longitud: 0,
  imgUrl: '',
  email: 'test@test.com',
  tipoDieta: {
    type: 'ComportamientoCompuesto',
    comportamientos: [
      {
        type: 'Vegano'
      },
      {
        type: 'Exquisito'
      }
    ]
  },
  distancia: 1,
  ingredientesAEvitar: [],
  ingredientesPreferidos: []
})

describe('AuthService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Limpiar localStorage antes de cada test
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  })

  /* loginUsuario() */
  it('loginUsuario - happy path', async () => {
    mockedAxios.post.mockResolvedValue({ data: AUTH_RESPONSE_MOCK })

    const result = await authService.loginUsuario({
      username: 'testuser',
      password: 'password123'
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/usuario/login'),
      { username: 'testuser', password: 'password123' }
    )
    expect(result).toEqual(AUTH_RESPONSE_MOCK)
  })

  it('loginUsuario - sad path', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('401 Unauthorized'))

    await expect(
      authService.loginUsuario({
        username: 'testuser',
        password: 'wrongpassword'
      })
    ).rejects.toThrow()
  })

  /* registarUsuario() */
  it('registarUsuario - happy path', async () => {
    mockedAxios.post.mockResolvedValue({ data: AUTH_RESPONSE_MOCK })

    const result = await authService.registarUsuario({
      username: 'newuser',
      password: 'password123'
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/usuario/register'),
      { username: 'newuser', password: 'password123' }
    )
    expect(result).toEqual(AUTH_RESPONSE_MOCK)
  })

  it('registarUsuario - sad path', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('400 Bad Request'))

    await expect(
      authService.registarUsuario({
        username: 'existinguser',
        password: 'password123'
      })
    ).rejects.toThrow()
  })

  /* estaAutenticado() */
  it('estaAutenticado - retorna true cuando hay usuarioId en localStorage', () => {
    window.localStorage.setItem('usuarioId', '123')

    const result = authService.estaAutenticado()

    expect(result).toBe(true)
  })

  it('estaAutenticado - retorna false cuando no hay usuarioId en localStorage', () => {
    window.localStorage.clear()

    const result = authService.estaAutenticado()

    expect(result).toBe(false)
  })

  it('estaAutenticado - retorna false cuando usuarioId está vacío', () => {
    window.localStorage.setItem('usuarioId', '')

    const result = authService.estaAutenticado()

    expect(result).toBe(false)
  })

  /* obtenerIdUsuarioActual() */
  it('obtenerIdUsuarioActual - retorna el id como número cuando existe', () => {
    window.localStorage.setItem('usuarioId', '123')

    const result = authService.obtenerIdUsuarioActual()

    expect(result).toBe(123)
  })

  it('obtenerIdUsuarioActual - retorna null cuando no existe', () => {
    window.localStorage.clear()

    const result = authService.obtenerIdUsuarioActual()

    expect(result).toBeNull()
  })

  it('obtenerIdUsuarioActual - retorna null cuando usuarioId está vacío', () => {
    window.localStorage.setItem('usuarioId', '')

    const result = authService.obtenerIdUsuarioActual()

    expect(result).toBeNull()
  })

  /* obtenerUsuarioActual() */
  it('obtenerUsuarioActual - happy path', async () => {
    window.localStorage.setItem('usuarioId', '123')
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)

    const result = await authService.obtenerUsuarioActual()

    expect(usuarioService.getUsuario).toHaveBeenCalledWith(123)
    expect(result).toEqual(USUARIO_MOCK)
  })

  it('obtenerUsuarioActual - retorna null cuando no hay usuarioId', async () => {
    window.localStorage.clear()

    const result = await authService.obtenerUsuarioActual()

    expect(usuarioService.getUsuario).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('obtenerUsuarioActual - retorna null cuando getUsuario falla', async () => {
    window.localStorage.setItem('usuarioId', '123')
    vi.mocked(usuarioService.getUsuario).mockRejectedValue(new Error('404'))

    const result = await authService.obtenerUsuarioActual()

    expect(result).toBeNull()
  })

  /* cerrarSesion() */
  it('cerrarSesion - elimina usuarioId de localStorage', () => {
    window.localStorage.setItem('usuarioId', '123')

    authService.cerrarSesion()

    expect(window.localStorage.getItem('usuarioId')).toBeNull()
  })

  it('cerrarSesion - no falla cuando localStorage está vacío', () => {
    window.localStorage.clear()

    expect(() => authService.cerrarSesion()).not.toThrow()
    expect(window.localStorage.getItem('usuarioId')).toBeNull()
  })
})