import { describe, it, expect, beforeEach } from 'vitest'
import { Login } from '../../classes/Login'

describe('Login', () => {
  let login: Login

  beforeEach(() => {
    login = new Login()
  })

  describe('validarLogin()', () => {
    it('debe agregar error cuando username está vacío', () => {
      login.username = ''
      login.password = 'password123'

      login.validarLogin()

      expect(login.errors.username).toBe('Requerido')
      expect(login.tieneErrores()).toBe(true)
    })

    it('debe agregar error cuando username solo tiene espacios', () => {
      login.username = '   '
      login.password = 'password123'

      login.validarLogin()

      expect(login.errors.username).toBe('Requerido')
    })

    it('debe agregar error cuando password está vacío', () => {
      login.username = 'testuser'
      login.password = ''

      login.validarLogin()

      expect(login.errors.password).toBe('Requerido')
      expect(login.tieneErrores()).toBe(true)
    })

    it('debe agregar error cuando password tiene 5 caracteres o menos', () => {
      login.username = 'testuser'
      login.password = '12345'

      login.validarLogin()

      expect(login.errors.password).toBe('La contraseña debe tener más de 5 caracteres')
      expect(login.tieneErrores()).toBe(true)
    })

    it('debe agregar error cuando password tiene exactamente 5 caracteres', () => {
      login.username = 'testuser'
      login.password = '12345'

      login.validarLogin()

      expect(login.errors.password).toBe('La contraseña debe tener más de 5 caracteres')
    })

    it('no debe tener errores con datos válidos', () => {
      login.username = 'testuser'
      login.password = 'password123'

      login.validarLogin()

      expect(login.tieneErrores()).toBe(false)
      expect(Object.keys(login.errors).length).toBe(0)
    })

    it('debe agregar ambos errores cuando username y password están vacíos', () => {
      login.username = ''
      login.password = ''

      login.validarLogin()

      expect(login.errors.username).toBe('Requerido')
      expect(login.errors.password).toBe('Requerido')
      expect(login.tieneErrores()).toBe(true)
    })
  })

  describe('validarRegister()', () => {
    it('debe agregar error cuando username está vacío', () => {
      login.username = ''
      login.password = 'password123'
      login.confirmPassword = 'password123'

      login.validarRegister()

      expect(login.errors.username).toBe('Requerido')
    })

    it('debe agregar error cuando password está vacío', () => {
      login.username = 'testuser'
      login.password = ''
      login.confirmPassword = 'password123'

      login.validarRegister()

      expect(login.errors.password).toBe('Requerido')
    })

    it('debe agregar error cuando password tiene 5 o menos caracteres', () => {
      login.username = 'testuser'
      login.password = '12345'
      login.confirmPassword = '12345'

      login.validarRegister()

      expect(login.errors.password).toBe('La contraseña debe tener más de 5 caracteres')
    })

    it('debe agregar error cuando confirmPassword está vacío', () => {
      login.username = 'testuser'
      login.password = 'password123'
      login.confirmPassword = ''

      login.validarRegister()

      expect(login.errors.password).toBe('Requerido')
    })

    it('debe agregar error cuando las contraseñas no coinciden', () => {
      login.username = 'testuser'
      login.password = 'password123'
      login.confirmPassword = 'password456'

      login.validarRegister()

      expect(login.errors.password).toBe('Las contraseñas no coinciden')
    })

    it('no debe tener errores con datos válidos', () => {
      login.username = 'testuser'
      login.password = 'password123'
      login.confirmPassword = 'password123'

      login.validarRegister()

      expect(login.tieneErrores()).toBe(false)
      expect(Object.keys(login.errors).length).toBe(0)
    })
  })

  describe('validarPassword()', () => {
    it('debe retornar true cuando las contraseñas coinciden', () => {
      login.password = 'password123'
      login.confirmPassword = 'password123'

      const result = login.validarPassword()

      expect(result).toBe(true)
    })

    it('debe retornar false cuando las contraseñas no coinciden', () => {
      login.password = 'password123'
      login.confirmPassword = 'password456'

      const result = login.validarPassword()

      expect(result).toBe(false)
    })

    it('debe retornar false cuando una contraseña está vacía', () => {
      login.password = 'password123'
      login.confirmPassword = ''

      const result = login.validarPassword()

      expect(result).toBe(false)
    })
  })

  describe('tieneErrores()', () => {
    it('debe retornar true cuando hay errores', () => {
      login.errors = { username: 'Requerido' }

      const result = login.tieneErrores()

      expect(result).toBe(true)
    })

    it('debe retornar false cuando no hay errores', () => {
      login.errors = {}

      const result = login.tieneErrores()

      expect(result).toBe(false)
    })
  })

  describe('reiniciarErrores()', () => {
    it('debe limpiar todos los errores', () => {
      login.errors = {
        username: 'Requerido',
        password: 'Requerido'
      }

      login.reiniciarErrores()

      expect(Object.keys(login.errors).length).toBe(0)
      expect(login.tieneErrores()).toBe(false)
    })
  })

  describe('toLoginDTO()', () => {
    it('debe retornar un objeto con username y password', () => {
      login.username = 'testuser'
      login.password = 'password123'
      login.confirmPassword = 'password123'

      const result = login.toLoginDTO()

      expect(result).toEqual({
        username: 'testuser',
        password: 'password123'
      })
      expect(result).not.toHaveProperty('confirmPassword')
    })

    it('debe retornar un objeto vacío cuando los campos están vacíos', () => {
      login.username = ''
      login.password = ''

      const result = login.toLoginDTO()

      expect(result).toEqual({
        username: '',
        password: ''
      })
    })
  })
})