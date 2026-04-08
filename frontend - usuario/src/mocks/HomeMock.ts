import type { LocalCard } from '../models/localModels'
/* importo las imágenes para el mockk*/
import local1 from '../assets/images/local1.jpg'
import local2 from '../assets/images/local2.jpg'
import local3 from '../assets/images/local3.jpg'
import local4 from '../assets/images/parrillaHomero.png'

export const CARDS_MOCK: LocalCard[] = [
    {
      id: 1,
      nombre: 'La Cocina de Mama',
      direccion: 'Av. Siempre Viva, 123',
      img: local1,
      cercano: true
    },
    {
      id: 2,
      nombre: 'El sabor auténtico',
      direccion: 'Avenida Central, 456',
      img: local2,
      cercano: false
    },
    {
      id: 3,
      nombre: 'Delicias del mundo',
      direccion: 'Plaza Mayor, 789',
      img: local3,
      cercano: false
    },
    {
        id: 4,
        nombre: 'Parrilla Homero',
        direccion: 'Buen Viaje, 012',
        img: local4,
        cercano: true
    }
  ]