import { Plato } from '$lib/components/classes/Plato.svelte'
import axios from 'axios'
import { API_URL } from './Variables-entorno'

class PlatoService {
  async obtenerPlato(id: string): Promise<Plato> {
    const response = await axios.get(`${API_URL}/menu/plato/${id}`)
    return response.data
  }
  
  async editarPlato(plato: Plato, localId: string): Promise<Plato> {
    const payload = {
      plato: plato.toJson(),
      localId
    }
    const response = await axios.put(`${API_URL}/menu/plato/${plato.id}`, payload)
    return response.data
  }
  
  async crearPlato(plato: Plato, localId: string): Promise<Plato> {
    const payload = {
      plato: plato.toJson(),
      localId
    }
    const response = await axios.post(`${API_URL}/menu/plato`, payload)
    return response.data
  }
}

export const platoService = new PlatoService()
