import axios from 'axios'
import { API_URL } from '$lib/components/services/Variables-entorno'

export interface UsuarioRequest {
  username: string
  password: string
}
export interface UsuarioResponse {
  id: number | null
}

class AuthService {
  async login(usuario: UsuarioRequest): Promise<UsuarioResponse> {
    const { data } = await axios.post<UsuarioResponse>(   // hago un post esperando UsuarioResponse como output
      `${API_URL}/auth/login`,                            // url
      usuario                                             // parámetro
    )
    return data
  }

  async register(usuario: UsuarioRequest): Promise<UsuarioResponse> {
    const { data } = await axios.post<UsuarioResponse>(
      `${API_URL}/auth/register`,
      usuario
    )
    return data
  }
}

export const authService = new AuthService()
