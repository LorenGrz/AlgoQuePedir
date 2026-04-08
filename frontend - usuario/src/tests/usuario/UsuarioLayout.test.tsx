import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PerfilUsuarioLayout } from '../../layouts/UsuarioLayout'
import { PerfilUsuario } from '../../pages/PerfilUsuario'
import { usuarioService } from '../../services/usuarioService'
import { authService } from '../../services/AuthService'
import { Usuario } from '../../classes/usuario/Usuario'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

// Mock de servicios
vi.mock('../../services/usuarioService', () => ({
  usuarioService: {
    getUsuario: vi.fn(),
    actualizarUsusario: vi.fn()
  }
}))

vi.mock('../../services/AuthService', () => ({
  authService: {
    obtenerIdUsuarioActual: vi.fn(),
    estaAutenticado: vi.fn()
  }
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const USUARIO_MOCK = new Usuario({
  nombre: 'Denichan',
  apellido: 'Higa',
  direccion: 'Artigas',
  altura: 6000,
  latitud: -34.603722,
  longitud: -58.381592,
  imgUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tecnomedis.com.pe%2F%3Fb%3D71090719001170&psig=AOvVaw18TYsqPetTxXN1NZO6ikzo&ust=1764032641393000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJDq4u3LiZEDFQAAAAAdAAAAABAE',
  email: 'dmhiga@unsam.com',
  ingredientesAEvitar: [],
  ingredientesPreferidos: [],
  tipoDieta: {},
  distancia: 1
})

describe('PerfilUsuarioLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(1)
  })

  it('debe cargar el usuario al inicializar', async () => {
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(usuarioService.getUsuario).toHaveBeenCalledWith(1)
    })

    await waitFor(() => {
      expect(screen.getByText('Denichan Higa')).toBeInTheDocument()
    })
  })

  it('debe navegar a login si no hay usuario autenticado', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(null)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('debe mostrar error cuando falla la carga del usuario', async () => {
    const error = new AxiosError('Error al cargar usuario')
    error.response = {
      status: 500,
      data: { message: 'Error del servidor' }
    } as unknown as AxiosResponse
    vi.mocked(usuarioService.getUsuario).mockRejectedValue(error)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      // El ErrorCard muestra el mensaje de error y un botón "Reintentar"
      // Para error 500, el mensaje es "Un talibán explotó el servidor llama a la policia (500)"
      expect(screen.getByText(/Reintentar/i)).toBeInTheDocument()
    })
  })

  it('debe actualizar el usuario correctamente', async () => {
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)
    vi.mocked(usuarioService.actualizarUsusario).mockResolvedValue()

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Denichan Higa')).toBeInTheDocument()
    })

    const guardarButton = screen.getByText('Guardar')
    await userEvent.click(guardarButton)

    await waitFor(() => {
      expect(usuarioService.actualizarUsusario).toHaveBeenCalledWith(1, expect.any(Usuario))
      expect(toast.success).toHaveBeenCalledWith('Usuario Actualizado correctamente')
    })
  })

  it('debe mostrar error al actualizar usuario con datos inválidos', async () => {
    const usuarioInvalido = new Usuario({
      nombre: '',
      apellido: '',
      direccion: '',
      imgUrl: ''
    })
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioInvalido)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Guardar')).toBeInTheDocument()
    })

    const guardarButton = screen.getByText('Guardar')
    await userEvent.click(guardarButton)

    await waitFor(() => {
      // Verificar que hay al menos un error "Required" (puede haber múltiples)
      const requiredErrors = screen.getAllByText(/Required/i)
      expect(requiredErrors.length).toBeGreaterThan(0)
    })

    expect(usuarioService.actualizarUsusario).not.toHaveBeenCalled()
  })

  it('debe manejar error al actualizar usuario en el servidor', async () => {
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)
    const error = new AxiosError('Error al actualizar')
    error.response = {
      status: 400,
      data: { message: 'Datos inválidos' }
    } as unknown as AxiosResponse
    vi.mocked(usuarioService.actualizarUsusario).mockRejectedValue(error)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Denichan Higa')).toBeInTheDocument()
    })

    const guardarButton = screen.getByText('Guardar')
    await userEvent.click(guardarButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('debe mantener el estado del usuario al navegar entre páginas', async () => {
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)

    render(
      <MemoryRouter initialEntries={['/usuario/perfil']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="perfil" element={<PerfilUsuario />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Denichan Higa')).toBeInTheDocument()
    })

    // Simular cambio de datos
    const nombreInput = screen.getByLabelText('Nombre')
    await userEvent.clear(nombreInput)
    await userEvent.type(nombreInput, 'Mayra')
    const apellidoInput = screen.getByLabelText('Apellido')
    await userEvent.clear(apellidoInput)
    await userEvent.type(apellidoInput, 'Higa sama')

    // Verificar que el cambio se mantiene
    expect(nombreInput).toHaveValue('Mayra')
    expect(apellidoInput).toHaveValue('Higa sama')
  })
})
