// src/lib/components/classes/Ingrediente.svelte.ts

type Errors = Partial<Record<keyof Ingrediente, string>>

export class Ingrediente {
  id = $state('')
  nombre = $state('')
  grupoAlimenticio = $state('')
  origenAnimal = $state(false)
  costo = $state(0)
  errors = $state<Errors>({})

  constructor(init?: Partial<Ingrediente>) {
    if (init) Object.assign(this, init)
  }

  validar(): void {
    const err: Errors = {}

    if (!this.nombre || !this.nombre.trim()) {
      err.nombre = 'El nombre es requerido'
    }

    if (!this.grupoAlimenticio || !this.grupoAlimenticio.trim()) {
      err.grupoAlimenticio = 'El grupo alimenticio es requerido'
    }

    if (Number(this.costo) <= 0) {
      err.costo = 'El costo debe ser un número positivo'
    }

    this.errors = { ...err }
  }

  tieneErrores() {
    return Object.keys(this.errors).length > 0
  }

  resetErrores() {
    this.errors = {}
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
      grupoAlimenticio: this.grupoAlimenticio,
      origenAnimal: this.origenAnimal,
      costo: this.costo
    }
  }
}