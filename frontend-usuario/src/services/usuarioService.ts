import axios from 'axios'
import { API_URL } from '../env'
import type { Usuario } from '../classes/usuario/Usuario'

class UsuarioService {

  async getUsuario(id: number): Promise<Usuario> {
    const response = await axios.get<Usuario>(`${API_URL}/usuario/${id}`)
    const { data } = response
    return data
  }

  async actualizarUsusario(id: number, usuario: Usuario): Promise<void> {
    await axios.put<void>(`${API_URL}/usuario/${id}`, usuario)
  }
}

export const usuarioService = new UsuarioService()
