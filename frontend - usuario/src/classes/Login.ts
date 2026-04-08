import  type { LoginDTO } from '../models/LoginModel'

type Errors = Partial<Record<keyof LoginDTO, string>>

export class Login {
  username = ''
  password = ''
  confirmPassword = ''
  errors: Errors = {}

  validarLogin(): void {
    const err: Errors = {}

    if (!this.username || !this.username.trim()) {
      err.username = 'Requerido'
    }
    if (!this.password) {
      err.password = 'Requerido'
    } else if (this.password.length <= 5) {
      err.password = 'La contraseña debe tener más de 5 caracteres'
    }
    this.errors = { ...err }
  }

  validarPassword(): boolean {
    return this.password === this.confirmPassword
  }

  validarRegister(): void {
    const err: Errors = {}
    if (!this.username || !this.username.trim()) {
      err.username = 'Requerido'
    }
    if (!this.password) {
      err.password = 'Requerido' 
    } else if (this.password.length <= 5) {
      err.password = 'La contraseña debe tener más de 5 caracteres'
    } else if (!this.confirmPassword) {
      err.password = 'Requerido'
    } else if (!this.validarPassword()) {
      err.password = 'Las contraseñas no coinciden'
    }
  
    this.errors = { ...err }
  }

  tieneErrores(): boolean {
    return Object.keys(this.errors).length > 0
  }

  reiniciarErrores(): void {
    this.errors = {}
  }

  toLoginDTO(): LoginDTO {
    return {
      username: this.username,
      password: this.password
    }
  }
}
