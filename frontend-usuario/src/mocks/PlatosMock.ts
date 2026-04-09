import type { Plato } from '../models/platoModel'
import pizza from '../../../assets/images/pizza.jpg'
import hamburga from '../../../assets/images/hamburga.jpg'
import pasta from '../../../assets/images/pasta.jpg'
import ensalada from '../../../assets/images/ensalada.jpg'

export const PLATOS_MOCK: Plato[] = [
  {
    id: 1,
    nombre: 'Pizza Margherita',
    descripcion: 'Classic pizza with tomato sauce, mozzarella, and basil',
    precio: 12.99,
    img: pizza,
    popular: true
  },
  {
    id: 2,
    nombre: 'Hamburguesa clasica',
    descripcion: 'Hamburguesa completa clasica con papas fritas',
    precio: 14.99,
    img: hamburga,
    popular: true
  },
  {
    id: 3,
    nombre: 'Spaghetti Carbonara',
    descripcion: 'Spaghetti with creamy sauce, bacon, and parmesan cheese',
    precio: 11.99,
    img: pasta,
    popular: false
  },
  {
    id: 4,
    nombre: 'Ensalada de la huerta',
    descripcion: 'Deliciosa ensalada con mucho acheto y vinagreta pa',
    precio: 8.99,
    img: ensalada,
    popular: false
  }
]
