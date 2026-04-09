import React, { useState, useRef } from 'react'
import { Boton } from '../../components/Boton'
import logo from '../../assets/icons/olla.svg'
import ojoIcon from '../../assets/icons/ojo.svg'
import { authService } from '../../services/AuthService'
import { Login } from '../../classes/Login'
import { useParams, useNavigate, Link, type ErrorResponse } from 'react-router-dom'
import { getMensajeError } from '../../utils/errorHandling'


type AuthConfig = {
  titulo: string
  textoDelBoton: string
  footerText: string
  footerLinkText: string
  footerLinkTo: string
  mostrarConfirmarContrasena: boolean
  validar: (loginModel: Login) => void
  submit: (dto: { username: string; password: string }) => Promise<{ id: string }>
  onSuccess: (navigate: (path: string) => void) => void
}

const AUTH_CONFIGS: Record<'login' | 'register', AuthConfig> = {
  login: {
    titulo: 'Algo que pedir',
    textoDelBoton: 'Iniciar sesión',
    footerText: '¿No tienes cuenta?',
    footerLinkText: 'Regístrate',
    footerLinkTo: '/auth/register',
    mostrarConfirmarContrasena: false,
    validar: (loginModel) => loginModel.validarLogin(),
    submit: (dto) => authService.loginUsuario(dto),
    onSuccess: (navigate) => navigate('/home')
  },
  register: {
    titulo: 'Crea tu cuenta',
    textoDelBoton: 'Crear cuenta',
    footerText: '¿Ya tienes cuenta?',
    footerLinkText: 'Inicia sesión',
    footerLinkTo: '/auth/login',
    mostrarConfirmarContrasena: true,
    validar: (loginModel) => loginModel.validarRegister(),
    submit: (dto) => authService.registarUsuario(dto),
    onSuccess: (navigate) => {
      navigate('/auth/login')
    }
  }
}

export function AuthForm() {
  const inputClasses = 'border-2 border-gray-300 rounded-lg p-2 pr-10 w-full focus:border-red-600 focus:ring-0 focus:outline-none w-full'
  const inputErrorClasses = 'border-2 border-red-500 rounded-lg p-2 pr-10 w-full focus:border-red-600 focus:ring-0 focus:outline-none w-full'
 
  const { mode = 'login' } = useParams<{ mode: 'login' | 'register' }>()
  const navigate = useNavigate()

  const modo = AUTH_CONFIGS[mode || 'login']
  
  //Uso useRef para guardar el modo anterior
  const modoAnteriorRef = useRef<string>(mode)
  // Reseteo solo si el modo cambió
  const debeResetear = modoAnteriorRef.current !== mode
  if (debeResetear) {
    modoAnteriorRef.current = mode
  }
  
  // Estado inicial que se resetea cuando cambia el modo
  const [formValues, setFormValues] = useState(new Login())
  const [error, setError] = useState<string>('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  //Resetear cuando detectamos cambio de modo
  if (debeResetear) {
    // Se ejecuta durante el render, pero es seguro porque solo resetea el estado
    setFormValues(new Login())
    setError('')
  }

  // Manejador de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLogin = Object.assign(new Login(), {
      ...formValues,
      [e.target.name]: e.target.value,
      errors: {}
    })
    
    setFormValues(updatedLogin)
    setError('') 
  }
  
  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
  
    formValues.reiniciarErrores()

    modo.validar(formValues)
  
    if (formValues.tieneErrores()) {
      const updatedLogin = Object.assign(new Login(), {
        ...formValues,
        errors: formValues.errors
      })
      setFormValues(updatedLogin)
      return
    }

    try {
      const response = await modo.submit(formValues.toLoginDTO())
      
      if (response?.id) {
        window.localStorage.setItem('usuarioId', String(response.id))
      }
  
      modo.onSuccess(navigate)
      
    } catch (err) {
      const errorResponse = getMensajeError(err as unknown as ErrorResponse)
      setError(errorResponse.message)
    }
  }

  return (
    <section className="p-4">
      <div className="flex flex-row items-center justify-center mb-6 gap-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 flex-shrink-0">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{modo.titulo}</h2>
      </div>

      <form  className="flex flex-col">
        <fieldset className="mb-6 flex flex-col p-4">
          <label htmlFor="username">Usuario*</label>
          <input
            className={formValues.errors.username ? inputErrorClasses : inputClasses}
            type="text"
            id="username"
            name="username"
            placeholder="Escribir"
            value={formValues.username}
            onChange={handleChange}
            required
          />
          {formValues.errors.username && (
            <p className="text-red-500 text-sm mt-1">{formValues.errors.username}</p>
          )}
        </fieldset>

        <fieldset className="mb-6 flex flex-col p-4">
          <label htmlFor="password">Password*</label>
          <div className="relative w-full">
            <input
              className={formValues.errors.password ? inputErrorClasses : inputClasses}
              type={mostrarContrasena ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="●●●●●●●"
              value={formValues.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-opacity cursor-pointer"
            >
              <img
                src={ojoIcon}
                alt={mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                className={`w-5 h-5 ${mostrarContrasena ? 'opacity-100' : 'opacity-60'}`}
              />
            </button>
          </div>
          {formValues.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formValues.errors.password}</p>
          )}
        </fieldset>

        {modo.mostrarConfirmarContrasena && (
          <fieldset className="mb-6 flex flex-col p-4">
            <label htmlFor="confirmPassword">Re-ingrese el Password*</label>
            <div className="relative w-full">
              <input
                className={formValues.errors.password ? inputErrorClasses : inputClasses}
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="●●●●●●●"
                id="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword || ''}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-opacity cursor-pointer"
              >
                <img
                  src={ojoIcon}
                  alt={mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                  className={`w-5 h-5 ${mostrarContrasena ? 'opacity-100' : 'opacity-60'}`}
                />
              </button>
            </div>
          </fieldset>
        )}

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="px-4 mb-4">
          <Boton tipo="pildora" onClick={handleSubmit}>
            {modo.textoDelBoton}
          </Boton>
        </div>
      </form>

      <div className="text-center text-sm text-gray-600 p-4 mt-4">
        <span>{modo.footerText} <Link to={modo.footerLinkTo}>{modo.footerLinkText}</Link></span>
      </div>
    </section>
  )
}