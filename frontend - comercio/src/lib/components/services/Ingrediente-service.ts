import type { Ingrediente } from '../classes/Ingrediente.svelte'
import { API_URL } from './Variables-entorno'
import axios from 'axios'

class IngredienteService {
  usoApi: boolean = false
  //GET PARA OBTENER UN INGREDIENTE POR ID
  async obtenerPorId(id: string): Promise<Ingrediente> {
    const response = await axios.get<Ingrediente>(`${API_URL}/ingrediente/${id}`)
    return response.data
  }

  //GET PARA OBTENER TODOS LOS INGREDIENTES
  async obtenerTodos(): Promise<Ingrediente[]> {
    const response = await axios.get<Ingrediente[]>(`${API_URL}/ingredientes`)
    return response.data
  }

  //POST PARA CREAR UN INGREDIENTE
  async crear(ingrediente: Ingrediente): Promise<Ingrediente> {
    const data = ingrediente.toJson()  // ← El servicio llama toJson() internamente
    const response = await axios.post(`${API_URL}/ingrediente`, data)
    return response.data
  }
  
  //PUT PARA ACTUALIZAR UN INGREDIENTE
  async actualizar(ingrediente: Ingrediente): Promise<Ingrediente> {
    const data = ingrediente.toJson()  // ← Con ID para editar
    const response = await axios.put(`${API_URL}/ingrediente`, data)
    return response.data
  }

  //DELETE PARA ELIMINAR UN INGREDIENTE
  async eliminar(ingrediente: Ingrediente): Promise<void> {
    const response = await axios.delete(`${API_URL}/ingrediente/eliminar`, { data: ingrediente } )
    return response.data
  }
}

export const ingredienteService = new IngredienteService()