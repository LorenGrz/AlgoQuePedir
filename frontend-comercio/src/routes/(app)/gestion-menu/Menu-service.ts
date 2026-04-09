import axios from 'axios'
import { Plato } from '$lib/components/classes/Plato.svelte'
import { API_URL } from '$lib/components/services/Variables-entorno'

interface MenuResponse {
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  img: string
}

class MenuService {
  async obtenerPlatos(): Promise<Plato[]> {
    const response = await axios.get<MenuResponse[]>(API_URL + '/menu')
    const { data } = response

    const platos = data.map((dto) => {
      const p = new Plato()

      Object.assign(p, {
        id: dto.id,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precioBase: dto.precio,
        imgUrl: dto.img
      })

      return p
    })

    return platos
  }
}

export const menuService = new MenuService()