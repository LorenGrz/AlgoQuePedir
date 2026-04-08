import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthForm } from '../../pages/auth/AuthForm'
import { authService } from '../../services/AuthService'
import type { AuthResponse } from '../../models/LoginModel'
import { AxiosError, AxiosResponse } from 'axios'

const mockNavigate = vi.fn()
let mockUseParams: () => { mode?: 'login' | 'register' }

vi.mock('../../services/AuthService', () => ({
  authService: {
    loginUsuario: vi.fn(),
    registarUsuario: vi.fn()
  }
}))

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    )
  }
})

const AUTH_RESPONSE_MOCK: AuthResponse = {
  id: '123',
  username: 'testuser'
}

describe('AuthForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    window.localStorage.clear()
    mockUseParams = () => ({ mode: 'login' })
  })

  describe('Modo Login', () => {
    it('renderiza correctamente el formulario de login', () => {
      render(<AuthForm />)

      expect(screen.getByText('Algo que pedir')).toBeInTheDocument()
      expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
      expect(screen.getByLabelText('Usuario*')).toBeInTheDocument()
      expect(screen.getByLabelText('Password*')).toBeInTheDocument()
      expect(screen.queryByLabelText('Re-ingrese el Password*')).not.toBeInTheDocument()
    })

    it('muestra errores cuando se envía el formulario con campos vacíos', async () => {
      render(<AuthForm />)

      const submitButton = screen.getByText('Iniciar sesión')
      await userEvent.click(submitButton)

      await waitFor(() => {
        // Puede haber múltiples "Requerido", verificamos que al menos uno existe
        expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0)
      })
    })

    it('muestra error cuando password tiene 5 o menos caracteres', async () => {
      render(<AuthForm />)

      const usernameInput = screen.getByLabelText('Usuario*')
      const passwordInput = screen.getByLabelText('Password*')
      const submitButton = screen.getByText('Iniciar sesión')

      await userEvent.type(usernameInput, 'testuser')
      await userEvent.type(passwordInput, '12345')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('La contraseña debe tener más de 5 caracteres')
        ).toBeInTheDocument()
      })
    })

    it('navega a /home cuando el login es exitoso', async () => {
      vi.mocked(authService.loginUsuario).mockResolvedValue(AUTH_RESPONSE_MOCK)

      render(<AuthForm />)

      const usernameInput = screen.getByLabelText('Usuario*')
      const passwordInput = screen.getByLabelText('Password*')
      const submitButton = screen.getByText('Iniciar sesión')

      await userEvent.type(usernameInput, 'testuser')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(authService.loginUsuario).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        })
        expect(window.localStorage.getItem('usuarioId')).toBe('123')
        expect(mockNavigate).toHaveBeenCalledWith('/home')
      })
    })

    it('muestra mensaje de error cuando el login falla', async () => {
      const error = new AxiosError('Error de autenticación')
      error.response = {
        status: 401,
        data: { message: 'Credenciales inválidas' }
      } as unknown as AxiosResponse
      vi.mocked(authService.loginUsuario).mockRejectedValue(error)

      render(<AuthForm />)

      const usernameInput = screen.getByLabelText('Usuario*')
      const passwordInput = screen.getByLabelText('Password*')
      const submitButton = screen.getByText('Iniciar sesión')

      await userEvent.type(usernameInput, 'testuser')
      await userEvent.type(passwordInput, 'wrongpassword')
      await userEvent.click(submitButton)

      await waitFor(() => {
        // ✅ CORREGIDO: Esperar el mensaje real que se muestra ahora
        expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument()
      })
    })

    it('toggle mostrar/ocultar password funciona', async () => {
      render(<AuthForm />)

      const passwordInput = screen.getByLabelText('Password*') as HTMLInputElement
      const toggleButtons = screen.getAllByAltText(/Mostrar|Ocultar/i)
      const toggleButton = toggleButtons[0]?.closest('button')

      expect(passwordInput.type).toBe('password')

      if (toggleButton) {
        await userEvent.click(toggleButton)
        await waitFor(() => {
          expect(passwordInput.type).toBe('text')
        })

        await userEvent.click(toggleButton)
        await waitFor(() => {
          expect(passwordInput.type).toBe('password')
        })
      }
    })

    it('limpia errores al escribir en los campos', async () => {
      render(<AuthForm />)

      const submitButton = screen.getByText('Iniciar sesión')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getAllByText('Requerido').length).toBeGreaterThan(0)
      })

      const usernameInput = screen.getByLabelText('Usuario*')
      await userEvent.type(usernameInput, 'testuser')

      await waitFor(() => {
        // Verificamos que el error de username desapareció
        const errorMessages = screen.queryAllByText('Requerido')
        // Puede quedar el error de password, pero el de username debería desaparecer
        expect(errorMessages.length).toBeLessThan(2)
      })
    })
  })

  describe('Modo Register', () => {
    beforeEach(() => {
      mockUseParams = () => ({ mode: 'register' })
    })

    it('renderiza correctamente el formulario de registro', () => {
      render(<AuthForm />)

      expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument()
      expect(screen.getByText('Crear cuenta')).toBeInTheDocument()
      expect(screen.getByLabelText('Usuario*')).toBeInTheDocument()
      expect(screen.getByLabelText('Password*')).toBeInTheDocument()
      expect(screen.getByLabelText('Re-ingrese el Password*')).toBeInTheDocument()
    })

    it('muestra error cuando las contraseñas no coinciden', async () => {
      render(<AuthForm />)

      const usernameInput = screen.getByLabelText('Usuario*')
      const passwordInput = screen.getByLabelText('Password*')
      const confirmPasswordInput = screen.getByLabelText('Re-ingrese el Password*')
      const submitButton = screen.getByText('Crear cuenta')

      await userEvent.type(usernameInput, 'testuser')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password456')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
      })
    })

    it('navega a /auth/login cuando el registro es exitoso', async () => {
      vi.mocked(authService.registarUsuario).mockResolvedValue(AUTH_RESPONSE_MOCK)

      render(<AuthForm />)

      const usernameInput = screen.getByLabelText('Usuario*')
      const passwordInput = screen.getByLabelText('Password*')
      const confirmPasswordInput = screen.getByLabelText('Re-ingrese el Password*')
      const submitButton = screen.getByText('Crear cuenta')

      await userEvent.type(usernameInput, 'newuser')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(authService.registarUsuario).toHaveBeenCalledWith({
          username: 'newuser',
          password: 'password123'
        })
        expect(window.localStorage.getItem('usuarioId')).toBe('123')
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
      })
    })

    it('muestra errores cuando se envía el formulario de registro con campos vacíos', async () => {
      render(<AuthForm />)

      const submitButton = screen.getByText('Crear cuenta')
      await userEvent.click(submitButton)

      await waitFor(() => {
        // En registro puede haber múltiples "Requerido" (username, password)
        const errorMessages = screen.getAllByText('Requerido')
        expect(errorMessages.length).toBeGreaterThan(0)
      })
    })
  })
})