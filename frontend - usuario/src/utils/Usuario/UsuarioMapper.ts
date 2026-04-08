import { TipoDieta, TipoDietaJson } from '../../models/usuarioModel'
import { Comun, Conservador, Exquisito, Fiel, Impaciente, Marketinero, Vegano } from '../../classes/usuario/UsuarioComportamiento'
import { LocalFromApi, LocalResumen } from '../../models/localModels'
import { TipoDietaEnum } from '../../models/usuarioModel'

export const mapTipoDietaFromJson = (json: TipoDietaJson): TipoDieta[] => {
  switch (json.type) {
    case TipoDietaEnum.COMPUESTO:
      return json.comportamientos
      ? json.comportamientos.flatMap(mapTipoDietaFromJson)
      : []
    
    case TipoDietaEnum.FIEL: {
      const fiel = new Fiel()
      fiel.localesPreferidos = json.localesPreferidos?.map((localJson: LocalFromApi) => mapLocalFromJson(localJson)) ?? []
      return [fiel]
    }

    case TipoDietaEnum.MARKETINERO: {
      const mk = new Marketinero()
      mk.palabrasClave = json.palabrasClave ?? []
      return [mk]
    }

    case TipoDietaEnum.IMPACIENTE: 
      return [new Impaciente()]
    case TipoDietaEnum.EXQUISITO:
      return [new Exquisito()]
    case TipoDietaEnum.CONSERVADOR:
      return [new Conservador()]
    case TipoDietaEnum.VEGANO:
      return [new Vegano()]
    default:
      return [new Comun()]
  }
}

const mapLocalFromJson = (json: LocalFromApi | LocalResumen): LocalResumen => {
  // Si viene en formato LocalFromApi
  if ('tiempoQueTarda' in json) {
    return {
      id: json.id,
      nombre: json.nombre,
      imgUrl: json.imgurl,
      puntuacion: json.puntuacion,
      tiempoMin: json.tiempoQueTarda[0],
      tiempoMax: json.tiempoQueTarda[1],
      direccion: json.direccion
    }
  }

  // Si viene en formato LocalResumen
  return {
    id: json.id,
    nombre: json.nombre,
    imgUrl: json.imgUrl,
    puntuacion: json.puntuacion,
    tiempoMin: json.tiempoMin,
    tiempoMax: json.tiempoMax,
    direccion: json.direccion
  }
}

export const mapTipoDietaToJson = (tipoDieta: TipoDieta[]): TipoDietaJson => {
  if (tipoDieta.length === 0){
    return { type: TipoDietaEnum.COMUN }
  } else if (tipoDieta.length === 1) {
    return { type: tipoDieta[0].constructor.name, ...tipoDieta[0] as TipoDieta }
  } else {
    return {
      type: TipoDietaEnum.COMPUESTO,
      comportamientos: tipoDieta.map(td => ({ type: td.constructor.name,  ...td as TipoDieta }))
    }
  }
}
