import type { CardHome } from '../models/localModels'
import { API_URL } from '../env'
import axios from 'axios'
import { authService } from './AuthService'

class HomeService {
  async getAll(): Promise<CardHome[]> {
    const userId = authService.obtenerIdUsuarioActual()
    const response = await axios.get<CardHome[]>(`${API_URL}/local/locales/${userId}`)
    return response.data
  }

  async getFiltered(search: string, onlyNearby: boolean) : Promise<CardHome[]> {
    const userId = authService.obtenerIdUsuarioActual()
    const response = await axios.get<CardHome[]>(`${API_URL}/local/${userId}/search`, {
      params: { search, onlyNearby }
    })
    return response.data
  }
}
export const homeService = new HomeService()
