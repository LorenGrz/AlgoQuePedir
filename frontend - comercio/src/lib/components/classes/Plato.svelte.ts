import type { Ingrediente } from './Ingrediente.svelte'

type Errors = Partial<Record<keyof Plato, string>>
const esHttp = (s: string) => /^https?:\/\/.+/i.test(s)

export class Plato {
  id = $state('')
  nombre = $state('')
  descripcion = $state('')
  precioBase = $state(0.0)
  imgUrl = $state('')
  autor = $state(false)
  enPromocion = $state(false)
  porcentajeDescuento = $state(0.0)
  ingredientes = $state<Ingrediente[]>([])
  errors = $state<Errors>({})

  nuevo = true
  lanzamiento = Date
  
  costoTotal = $derived(
    this.ingredientes.reduce((acc, ing) => acc + (ing.costo ?? 0), 0),
  )
  
  constructor(init?: Partial<Plato>) {
    if (init) Object.assign(this, init)
    this.enPromocion = this.porcentajeDescuento > 0
  }

  validar(): void{
    const err: Errors = {}

    if (!this.nombre || !this.nombre.trim()) {
      err.nombre = 'Requerido'
    }

    if (!this.descripcion || !this.descripcion.trim()) {
      err.descripcion = 'Requerido'
    }

    if (!this.imgUrl || !this.imgUrl.trim()) {
      err.imgUrl = 'Requerido'
    } else if (this.imgUrl && !esHttp(this.imgUrl)) {
      err.imgUrl = 'URL inválida (http/https)'
    }

    if (Number(this.precioBase) <= 0) {
      err.precioBase = 'Debe ser un entero positivo'
    }

    if (this.ingredientes.length == 0){
      err.ingredientes = 'Debe tener al menos un ingrediente'
    }

    this.errors = { ...err }
  }

  tieneErrores(){
    return Object.keys(this.errors).length > 0
  }

  resetErrores(){
    this.errors = {}
  }

  eliminarIngrediente(id: string) {
    this.ingredientes = this.ingredientes.filter(i => i.id !== id)
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imgUrl: this.imgUrl,
      precioBase: this.precioBase,
      autor: this.autor,
      ingredientes: this.ingredientes,
      porcentajeDescuento: this.porcentajeDescuento,
      lanzamiento: this.lanzamiento
    }
  }
}
