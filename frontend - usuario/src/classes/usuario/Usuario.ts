import { toast } from 'react-toastify'
import type { Ingrediente } from '../../models/ingredienteModel'
import { TipoDietaEnum, TipoDietaJson } from '../../models/usuarioModel'

type Errors = Partial<Record<keyof Usuario, string>>

export class Usuario {
  nombre: string = ''
  apellido: string = ''
  direccion: string = ''
  altura: number = 0
  latitud: number = 0
  longitud: number = 0
  imgUrl: string = ''
  email: string = ''

  ingredientesAEvitar: Ingrediente[] = []
  ingredientesPreferidos: Ingrediente[] = []
  
  tipoDieta: TipoDietaJson = {}
  distancia: number = 1

  errors: Errors = {}

  constructor(props?: Partial<Usuario>) {
    Object.assign(this, props)
  }

  validar(): Usuario{
    const err: Errors = {}

    const requiredList: (keyof Usuario)[] = ['nombre', 'apellido', 'direccion', 'imgUrl' ]
    for (const key of requiredList){
      const valor = this[key]
      if (typeof valor === 'string' && valor.trim().length === 0){
        err[key] = 'Required'
      }
    }
    if (this.altura < 0) {
      err.altura = 'Altura debe ser un numero positivo'
    }
 
    return new Usuario({...this, errors: err})
  }
  
  // ---- Ingredientes ----
  mostrarIngredientes = (listado: Ingrediente[], isPreferidos: boolean): Ingrediente[] => {
    let ingredientes: Ingrediente[] = []
    if (isPreferidos) {
      const evitarIds = new Set(this.ingredientesAEvitar.map((ing: Ingrediente) => ing.id))
      ingredientes = listado.filter(item => !evitarIds.has(item.id))
   
      if (this.tipoDieta.type == TipoDietaEnum.VEGANO || (this.tipoDieta.type == TipoDietaEnum.COMPUESTO && this.tipoDieta.comportamientos?.some(c => c.type == TipoDietaEnum.VEGANO))) {
        ingredientes = ingredientes.filter(item => !item.origenAnimal)
      }
    } else {
      const preferidosIds = new Set(this.ingredientesPreferidos.map((ing: Ingrediente) => ing.id))
      ingredientes = listado.filter(item => !preferidosIds.has(item.id))
    }
    return ingredientes
  }
  
  private agregarPreferido = (ing: Ingrediente) => {
    if (!this.ingredientesPreferidos.some(i => i.id === ing.id)){
      this.ingredientesPreferidos.push(ing)
    }
  }
  private agregarAEvitar = (ing: Ingrediente) => {
    if (!this.ingredientesAEvitar.some(i => i.id === ing.id)){
      this.ingredientesAEvitar.push(ing)
    }
  }
  agregarIng = (ing: Ingrediente, esPreferido: boolean) => {
    const ingEnOtraLista: Ingrediente[] = esPreferido ? this.ingredientesAEvitar : this.ingredientesPreferidos
    const yaEstaEnOtra = ingEnOtraLista.some(i => i.id === ing.id)

    if (yaEstaEnOtra) {
      toast.error('No se puede agregra porque pertenece a la otra lista')
    } else {
      esPreferido ? this.agregarPreferido(ing) : this.agregarAEvitar(ing)
    }
  }
  eliminarIngPreferido = (ing: Ingrediente): Ingrediente[] => {
    this.ingredientesPreferidos = this.ingredientesPreferidos.filter(i => i.id !== ing.id)
    return this.ingredientesPreferidos
  }
  eliminarIngEvitar = (ing: Ingrediente): Ingrediente[] => {
    this.ingredientesAEvitar = this.ingredientesAEvitar.filter(i => i.id !== ing.id)
    return this.ingredientesAEvitar
  }
}
