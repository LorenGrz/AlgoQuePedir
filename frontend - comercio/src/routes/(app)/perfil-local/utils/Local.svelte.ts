import type { LocalResponse } from './Local-service'

export type Metodos = { efectivo: boolean; qr: boolean; transferencia: boolean }
type Errors = Partial<Record<keyof Local, string>>
const enRango = (n: number, min: number, max: number) => n >= min && n <= max

export class Local {
  nombre: string = $state('')
  url: string = $state('')
  direccion: string = $state('')
  altura: number | undefined = $state()
  latitud: number | undefined = $state()
  longitud: number | undefined = $state()
  porcentajeApp: number | undefined = $state()
  porcentajeComision: number | undefined = $state()
  metodos: Metodos = $state({ efectivo: false, qr: false, transferencia: false })
  errors: Errors = $state({})

  validar(){
    const err: Errors = {}

    if (!this.nombre || !this.nombre.trim()) {
      err.nombre = 'Requerido'
    }

    if (!this.direccion || !this.direccion.trim()) {
      err.direccion = 'Requerido'
    }

    // Url (opcional pero si viene debe ser http/https)
    if (this.url && !/^https?:\/\/.+/i.test(this.url)) {
      err.url = 'URL inválida (http/https)'
    }

    // Altura mayor a 0
    if (!this.altura || Number(this.altura) <= 0) {
      err.altura = 'Debe ser un entero positivo'
    }

    // Latitud y longitud en rango valido
    if (this.latitud == null || !enRango(Number(this.latitud), -90, 90)) {
      err.latitud = 'Latitud debe estar entre -90 y 90'
    }

    if (this.longitud == null || !enRango(Number(this.longitud), -180, 180)) {
      err.longitud = 'Longitud debe estar entre -180 y 180'
    }

    // Porcentajes de 0 a 100
    if (this.porcentajeApp == null || !enRango(Number(this.porcentajeApp), 0, 100)) {
      err.porcentajeApp = 'Debe estar entre 0 y 100'
    }

    if (this.porcentajeComision == null || !enRango(Number(this.porcentajeComision), 0, 100)) {
      err.porcentajeComision = 'Debe estar entre 0 y 100'
    }

    if (!this.metodos.efectivo && !this.metodos.qr && !this.metodos.transferencia) {
      err.metodos = 'Elegí al menos un método de pago'
    }
    
    this.errors = { ...err }
  }

  tieneErrores(): boolean {
    return Object.keys(this.errors).length > 0
  }

  resetErrores() {
    this.errors = {}
  }

  toJson() {
    const { nombre, url, direccion, altura, latitud, longitud, porcentajeApp, porcentajeComision } = this

    return {
      nombre,
      url,
      direccion,
      altura,
      latitud,
      longitud,
      porcentajeApp,
      porcentajeComision,
      metodos: JSON.parse(JSON.stringify(this.metodos))
    }
  }
  
  fromJson(localJson: LocalResponse) {
    const { nombre, url, direccion, altura, latitud, longitud, porcentajeApp, porcentajeComision, metodos } = localJson

    this.nombre = nombre
    this.url = url
    this.direccion = direccion
    this.altura = altura
    this.latitud = latitud
    this.longitud = longitud
    this.porcentajeApp = porcentajeApp
    this.porcentajeComision = porcentajeComision
    this.metodos = metodos
  }
}