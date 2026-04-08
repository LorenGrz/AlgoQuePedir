import { LocalResumen } from '../../models/localModels';
import { TipoDietaEnum, TipoDietaEnumType } from '../../models/usuarioModel';
import { Usuario } from './Usuario';

export type ComportamientoErrors = Partial<Record<TipoDietaEnumType, string>>

export interface ComportamientoUsuario<type> {
  agregarItem?: (item: type) => void
  eliminarItem?: (item: type) => void
  validar?: (usuario?: Usuario) => ComportamientoErrors
}

export class Comun implements ComportamientoUsuario<null>{
  
}

export class Vegano implements ComportamientoUsuario<null>{
  validar = (usuario?: Usuario): ComportamientoErrors => {

    if (usuario?.ingredientesPreferidos.some(ing => ing.origenAnimal)){
      return {[TipoDietaEnum.VEGANO]: 'Existen ingredientes de origen animal en listado de Preferidos' }
    }
    return {}
  }
}

export class Exquisito implements ComportamientoUsuario<null>{
  
}

export class Conservador implements ComportamientoUsuario<null>{

}

export class Fiel implements ComportamientoUsuario<LocalResumen>{
  localesPreferidos: LocalResumen[] = []

  validar = (): ComportamientoErrors => {
    if (this.localesPreferidos.length === 0) {
      return {[TipoDietaEnum.FIEL]: 'Debés seleccionar al menos un local preferido' }
    }
    return {}
  }
  
  agregarItem = (local: LocalResumen) => {
    const yaPertenece = this.localesPreferidos.some(l => l.id === local.id)

    if (!yaPertenece) {
      this.localesPreferidos.push(local)
    }
  }

  eliminarItem = (item: LocalResumen) => {
    this.localesPreferidos = this.localesPreferidos.filter(l => l.id !== item.id)
  }
}

export class Impaciente implements ComportamientoUsuario<null>{
  
}

export class Marketinero implements ComportamientoUsuario<string>{
  palabrasClave: string[] = []

  validar = (): ComportamientoErrors => {
    if (this.palabrasClave.length === 0) {
      return {[TipoDietaEnum.MARKETINERO]: 'Debés seleccionar al menos un local preferido' }
    }
    return {}
  }

  agregarItem = (inputPalabras: string) => {
    const valor = inputPalabras.trim()
    this.palabrasClave.push(valor)
  }

  eliminarItem = (item: string) => {
    this.palabrasClave = this.palabrasClave.filter(p => p !== item)
  }
}

export class ComportamientoCompuesto implements ComportamientoUsuario<any> {
  comportamientos: ComportamientoUsuario<any>[]

  constructor(comps: ComportamientoUsuario<any>[] = []) {
    this.comportamientos = comps
  }

  agregarItem = (comp: ComportamientoUsuario<any>) => {
    this.comportamientos.push(comp)
  }

  eliminarItem = (item: string) => {
    this.comportamientos = this.comportamientos.filter(p => p !== item)
  }
}
