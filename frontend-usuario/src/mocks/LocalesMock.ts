import type { LocalResumen } from '../models/localModels'
import imagenLocal from '../assets/images/imagen-local.jpg'
import pizza from '../assets/images/pizza.jpg'
import hamburga from '../assets/images/hamburga.jpg'
import pescado from '../assets/images/pescado.jpg'

export const LOCALES_CALIFICAR_MOCK: LocalResumen[] = [
  {
    id: 1,
    nombre: 'La Pizzeria',
    puntuacion: 4.5,
    tiempoMin: 25,
    tiempoMax: 35,
    pesos: 2,
    imgUrl: pizza
  },
  {
    id: 2,
    nombre: 'El Gran Sabor',
    puntuacion: 4.2,
    tiempoMin: 30,
    tiempoMax: 40,
    pesos: 2,
    imgUrl: imagenLocal
  },
  {
    id: 3,
    nombre: 'Sushi Express',
    puntuacion: 4.8,
    tiempoMin: 20,
    tiempoMax: 30,
    pesos: 3,
    imgUrl: pescado
  },
  {
    id: 4,
    nombre: 'Burger Joint',
    puntuacion: 4.0,
    tiempoMin: 25,
    tiempoMax: 35,
    pesos: 1,
    imgUrl: hamburga
  }
]
