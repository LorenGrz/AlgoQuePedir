import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calificaciones } from '../../pages/Calificaciones'
import { calificacionesService } from '../../services/calificacionesService'
import { authService } from '../../services/AuthService'
import type { LocalResumen } from '../../models/localModels'
import { useEffect } from 'react'

const mockNavigate = vi.fn()

vi.mock('../../services/calificacionesService', () => ({
  calificacionesService: {
    traerLocalesPendientes: vi.fn()
  }
}))

vi.mock('../../services/AuthService', () => ({
  authService: {
    obtenerIdUsuarioActual: vi.fn()
  }
}))

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// ✅ CORREGIDO: Usar useEffect real para evitar re-renders infinitos
vi.mock('../../utils/hooks', () => ({
  useOnInit: (fn: () => void) => {
    useEffect(() => {
      fn()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }
}))

const LOCALES_MOCK: LocalResumen[] = [
  {
    id: 1,
    nombre: 'Restaurante Italiano',
    puntuacion: 4.5,
    tiempoMin: 30,
    tiempoMax: 45,
    imgUrl: 'italiano.jpg',
    direccion: {calle: '', altura: 0, ubicacion: ''}
  },
  {
    id: 2,
    nombre: 'Pizzería Napolitana',
    puntuacion: 4.8,
    tiempoMin: 25,
    tiempoMax: 40,
    imgUrl: 'pizzeria.jpg',
    direccion: {calle: '', altura: 0, ubicacion: ''}
  }
]

describe('Calificaciones', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('muestra la lista de locales pendientes cuando se cargan correctamente', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)
    vi.mocked(calificacionesService.traerLocalesPendientes).mockResolvedValue(LOCALES_MOCK)

    render(<Calificaciones />)

    await waitFor(() => {
      expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
      expect(screen.getByText('Pizzería Napolitana')).toBeInTheDocument()
    })
  })

  it('muestra mensaje cuando no hay locales pendientes', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)
    vi.mocked(calificacionesService.traerLocalesPendientes).mockResolvedValue([])

    render(<Calificaciones />)

    await waitFor(() => {
      expect(
        screen.getByText('No hay restaurantes disponibles para calificar')
      ).toBeInTheDocument()
    })
  })

  it('navega a login cuando no hay usuario autenticado', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(null)

    render(<Calificaciones />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('muestra error cuando falla la carga de locales', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)
    vi.mocked(calificacionesService.traerLocalesPendientes).mockRejectedValue(
      new Error('Error de red')
    )

    render(<Calificaciones />)

    await waitFor(() => {
      expect(screen.getByText('Error de red')).toBeInTheDocument()
    })
  })

  it('navega a calificar local cuando se hace click en calificar', async () => {
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)
    vi.mocked(calificacionesService.traerLocalesPendientes).mockResolvedValue(LOCALES_MOCK)

    render(<Calificaciones />)

    await waitFor(() => {
      expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    })

    const botonesCalificar = screen.getAllByText('Calificar')
    // Simular click en el primer botón
    await userEvent.click(botonesCalificar[0])

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/calificarlocal/1')
    })
  })
})