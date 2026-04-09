import { describe, it, expect, beforeEach } from 'vitest'
import { Ingrediente } from '$lib/components/classes/Ingrediente.svelte'

describe ('Ingrediente', () => {
  let ingrediente: Ingrediente

  beforeEach(() => {
    ingrediente = new Ingrediente()
  })

  it('INICIALIZA LOS VALORES POR DEFECTO CORRECTOS', () => {
    expect(ingrediente.id).toBe('')
    expect(ingrediente.nombre).toBe('')
    expect(ingrediente.grupoAlimenticio).toBe('')
    expect(ingrediente.origenAnimal).toBe(false)
    expect(ingrediente.costo).toBe(0)
    expect(ingrediente.errors).toEqual({})
  })

  it('VALIDA CORRECTAMENTE LOS CAMPOS REQUERIDOS', () => {
    ingrediente.validar()
    
    expect(ingrediente.tieneErrores()).toBe(true)
    expect(ingrediente.errors.nombre).toBe('El nombre es requerido')
    expect(ingrediente.errors.grupoAlimenticio).toBe('El grupo alimenticio es requerido')
    expect(ingrediente.errors.costo).toBe('El costo debe ser un número positivo')
  })

  it('CUMPLE LA  VALIDACIÓN CON DATOS VÁLIDOS', () => {
    ingrediente.nombre = 'Lechuga'
    ingrediente.grupoAlimenticio = 'FRUTAS_Y_VERDURAS'
    ingrediente.costo = 150
    
    ingrediente.validar()
    
    expect(ingrediente.tieneErrores()).toBe(false)
    expect(ingrediente.errors).toEqual({})
  })

  it('RESETEA LOS ERRORES CORRECTAMENTE', () => {
    ingrediente.validar()
    expect(ingrediente.tieneErrores()).toBe(true)
    
    ingrediente.resetErrores()
    expect(ingrediente.tieneErrores()).toBe(false)
    expect(ingrediente.errors).toEqual({})
  })

  it('CONVIERTE A JSON CORRECTAMENTE UN INGREDIENTE', () => {
    ingrediente.id = '1'
    ingrediente.nombre = 'Tomate'
    ingrediente.grupoAlimenticio = 'FRUTAS_Y_VERDURAS'
    ingrediente.origenAnimal = false
    ingrediente.costo = 200
    
    const json = ingrediente.toJson()
    
    expect(json).toEqual({
      id: '1',
      nombre: 'Tomate',
      grupoAlimenticio: 'FRUTAS_Y_VERDURAS',
      origenAnimal: false,
      costo: 200
    })
  })
})