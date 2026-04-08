import { describe, it, expect, beforeEach } from 'vitest'
import { Login } from '../../utils/Login.svelte'

describe('Login - Validaciones', () => {
  let login: Login

  beforeEach(() => {
    login = new Login()
  })

  // validateLogin()
  it('salta error cuando user está vacío', () => {
    login.user = ''
    login.password = '123'

    login.validateLogin()

    expect(login.errors.user).toBe('Requerido')
    expect(login.errors.password).toBeUndefined()
  })

  it('sañta error cuando password está vacío', () => {
    login.user = 'pedro'
    login.password = ''

    login.validateLogin()

    expect(login.errors.user).toBeUndefined()
    expect(login.errors.password).toBe('Requerido')
  })

  it('salta error cuando ambos campos están vacíos', () => {
    login.user = ''
    login.password = ''

    login.validateLogin()

    expect(login.errors.user).toBe('Requerido')
    expect(login.errors.password).toBe('Requerido')
  })

  it('salta error cuando user tiene solo espacios', () => {
    login.user = '   '
    login.password = '123'

    login.validateLogin()

    expect(login.errors.user).toBe('Requerido')
  })

  it('todo ok cuando ambos campos están llenos', () => {
    login.user = 'pedro'
    login.password = '123'

    login.validateLogin()

    expect(login.tieneErrores()).toBe(false)
  })

  // validateRegister()
  it('marca error en confirmPassword cuando no coinciden las contraseñas', () => {
    login.user = 'pedro'
    login.password = '123'
    login.confirmPassword = '456'

    login.validateRegister()

    expect(login.errors.confirmPassword).toBe('Las contraseñas no coinciden')
  })

  it('marca error cuando confirmPassword está vacío', () => {
    login.user = 'pedro'
    login.password = '123'
    login.confirmPassword = ''

    login.validateRegister()

    expect(login.errors.confirmPassword).toBe('Requerido')
  })

  it('no marca errores cuando todo está correcto en register', () => {
    login.user = 'pedro'
    login.password = '123'
    login.confirmPassword = '123'

    login.validateRegister()

    expect(login.tieneErrores()).toBe(false)
  })

  // pruebo el tieneErrores() 
  it('tieneErrores devuelve true cuando hay errores', () => {
    login.errors = { user: 'Requerido' }

    expect(login.tieneErrores()).toBe(true)
  })

  it('tieneErrores devuelve false cuando no hay errores', () => {
    login.errors = {}

    expect(login.tieneErrores()).toBe(false)
  })

  // acá pruebo el reset
  it('resetErrores limpia todos los errores', () => {
    login.errors = { user: 'Requerido', password: 'Requerido' }

    login.resetErrores()

    expect(login.tieneErrores()).toBe(false)
    expect(Object.keys(login.errors).length).toBe(0)
  })
})