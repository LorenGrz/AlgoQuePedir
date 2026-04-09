import axios from 'axios'
import { API_URL } from '../env'

import type { AuthResponse, LoginDTO } from '../models/LoginModel'
import { Usuario } from '../models/usuarioModel'
import { usuarioService } from './usuarioService'

class AuthService {
  async loginUsuario(credenciales: LoginDTO): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_URL + '/auth/usuario/login', credenciales)
    return response.data
  }

  async registarUsuario(credenciales: LoginDTO): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      API_URL + '/auth/usuario/register',
      credenciales
    )
    return response.data
  }

  estaAutenticado(): boolean {
    if (typeof window === 'undefined') return false
    const usuarioId = window.localStorage.getItem('usuarioId')
    return usuarioId !== null && usuarioId !== ''
  }

  obtenerIdUsuarioActual(): number | null {
    if (typeof window === 'undefined') return null
    const usuarioId = window.localStorage.getItem('usuarioId')
    return usuarioId ? Number(usuarioId) : null
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    const userId = this.obtenerIdUsuarioActual()
    if (!userId) return null
    try {
      return await usuarioService.getUsuario(userId)
    } catch {
      return null
    }
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('usuarioId')
    }
  }
}

export const authService = new AuthService()
