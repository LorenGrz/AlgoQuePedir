import axios from 'axios'
import { API_URL } from '../env'
import type { Ingrediente } from '../models/ingredienteModel'

class IngredienteService {
  async getIngredintes(): Promise<Ingrediente[]> {
    const response = await axios.get<Ingrediente[]>(`${API_URL}/ingredientes`)
    const { data } = response
    return data
  }
}

export const ingredienteService = new IngredienteService()
