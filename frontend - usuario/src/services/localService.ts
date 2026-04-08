import axios from 'axios'
import { API_URL } from '../env'
import type { LocalCompleto, LocalResumen } from '../models/localModels'
import type { Plato } from '../models/platoModel'
import { authService } from './AuthService'

class LocalService {
  async getLocal(id: number): Promise<LocalCompleto> {
    const response = await axios.get<LocalCompleto>(API_URL + '/localpublico/' + id)
    const { data } = response

    /* Local es un type porque solo necesita mostrar datos, no tiene comportamiento (hasta acá)
    Las reglas de negocio están en Pedido que sí encapsula comportamiento. (agregarItem())
    Entonces no necesito mapear Local a un objeto de dominio */
    return data
  }

  async getLocalesResumen(): Promise<LocalResumen[]> {
    const response = await axios.get<LocalResumen[]>(`${API_URL}/local/allResumen`)
    const { data } = response
    return data
  }

  async getPlatosLocal(id: number): Promise<Plato[]> {
    const userId = authService.obtenerIdUsuarioActual()
    const response = await axios.get<Plato[]>(`${API_URL}/localpublico/${id}/menu?userId=${userId}`)
    
    const { data } = response
    /* Plato es un type por lo mismo que Local */
    return data
  }
}

export const localService = new LocalService()
