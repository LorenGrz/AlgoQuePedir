import type { Resena, LocalCompleto } from '../models/localModels'

export const RESENAS_MOCK: Resena[] = [
  {
    idResena: 1,
    user: 'Max Verstappen',
    comentario: 'Muy malo todo pésimo',
    puntuacion: 5,
    fecha: 'Hace 2 días'
  },
  {
    idResena: 2,
    user: 'Enrico Sangiuliano',
    comentario: 'Malardo broooooo muy malo',
    puntuacion: 4.5,
    fecha: 'Hace 5 días'
  },
  {
    idResena: 3,
    user: 'Pablo Foglia',
    comentario: 'Excelente la puntualidad sisisi de la entrega. La ensalada medio pelo.',
    puntuacion: 3.5,
    fecha: 'Hace 25 días'
  },
  {
    idResena: 4,
    user: 'Luis Majul',
    comentario: 'Muy cheto malll el spaghetti carbonara. El delivery medio lento.',
    puntuacion: 4,
    fecha: 'Hace 29 días'
  }
]

export const LOCAL_MOCK: LocalCompleto = {
  id: 4,
  nombre: 'La casa de Juan',
  puntajeTotal: 4.3,
  totalVentas: 546,
  img: '',
  resenas: RESENAS_MOCK,
  distanciaKm: 10,
  envioGratis: true,
  metodosDePago: ['EFECTIVO', 'QR']
}
