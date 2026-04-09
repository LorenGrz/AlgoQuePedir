type Errors = Partial<Record<keyof Login, string>>

export class Login{     /* clase para probar Login y Register*/
  user = $state('')
  password = $state('')
  confirmPassword = $state('')
  errors = $state<Errors>({})

  validateLogin(){       /* Disparo los errores en login */
    const err: Errors = {}

    if (!this.user || !this.user.trim()) {
      err.user = 'Requerido'
    }
    if (!this.password) {
      err.password = 'Requerido'
    }
    this.errors = {...err}
  }


  validatePassword(){   /* Para usar en Register.svelte */
    return this.password === this.confirmPassword
  }
  
  validateRegister(){    /* Disparo los errores en register */
    const err: Errors = {}
    if (!this.user || !this.user.trim()) {
      err.user = 'Requerido'
    }
    if (!this.password) {
      err.password = 'Requerido'
    } 
    if (!this.confirmPassword) {
      err.confirmPassword = 'Requerido'
    } else if (!this.validatePassword()) {
      err.confirmPassword = 'Las contraseñas no coinciden'
    }
    

    this.errors = { ...err}   
  }

  tieneErrores(){
    return Object.keys(this.errors).length > 0
  }
  resetErrores(){
    this.errors = {}
  }
}