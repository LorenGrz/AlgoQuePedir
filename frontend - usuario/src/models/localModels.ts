export type Resena = {
  idResena: number
  user: string
  comentario: string
  puntuacion: number
  fecha: string
}

export type LocalCompleto = {
  id: number | null
  nombre: string
  puntajeTotal: number
  totalVentas: number
  resenas: Resena[]
  img: string
  distanciaKm: number
  envioGratis: boolean
  metodosDePago: string[]
}

export interface LocalResumen {
  id: number
  nombre: string
  puntuacion: number
  tiempoMin: number
  tiempoMax: number
  imgUrl: string
  direccion: Direccion
}

export interface LocalFromApi {
  id: number,
  nombre: string,
  imgurl: string,
  puntuacion: number,
  tiempoQueTarda: number[]
  direccion: Direccion
}

export interface Direccion {
  calle: string,
  altura: number
  ubicacion: string
}

export interface LocalCalificacion {
  localId: number
  localNombre: string
  puntuacion: number
  comentario: string
}

export interface CardHome {
  id: number
  nombre: string
  direccion: string
  altura: number
  img: string
  cercano: boolean
}
