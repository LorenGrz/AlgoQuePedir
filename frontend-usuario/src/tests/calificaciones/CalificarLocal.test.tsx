import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalificarLocal } from '../../components/calificaciones/CalificarLocal'
import { localService } from '../../services/localService'
import { calificacionesService } from '../../services/calificacionesService'
import { authService } from '../../services/AuthService'
import type { LocalCompleto } from '../../models/localModels'
import type { CalificacionResponse } from '../../models/CalificacionModel'
import { useEffect } from 'react'

const mockNavigate = vi.fn()
let mockUseParams: () => { id?: string }

vi.mock('../../services/localService', () => ({
  localService: {
    getLocal: vi.fn()
  }
}))

vi.mock('../../services/calificacionesService', () => ({
  calificacionesService: {
    calificar: vi.fn()
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
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams()
  }
})


vi.mock('../../utils/hooks', () => ({
  useOnInit: (fn: () => void) => {
    useEffect(() => {
      fn()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }
}))

const LOCAL_COMPLETO_MOCK: LocalCompleto = {
  id: 1,
  nombre: 'Restaurante Italiano',
  puntajeTotal: 4.5,
  totalVentas: 100,
  resenas: [],
  img: 'italiano.jpg',
  distanciaKm: 2.5,
  envioGratis: true,
  metodosDePago: ['EFECTIVO', 'QR']
}

const CALIFICACION_RESPONSE_MOCK: CalificacionResponse = {
  ok: true,
  puntajePromedio: 4.5,
  mensaje: 'Calificación enviada exitosamente'
}

describe('CalificarLocal', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockUseParams = () => ({ id: '1' })
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)
    // Mock de alert
    window.alert = vi.fn()
  })

  it('muestra loading mientras carga el local', async () => {
    vi.mocked(localService.getLocal).mockImplementation(
      () => new Promise(() => {}) // Promise que nunca se resuelve
    )

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })
  })

  it('muestra el formulario de calificación cuando se carga el local', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(
        screen.getByText(/¿Cómo fue tu experiencia con Restaurante Italiano?/i)
      ).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Contanos tu experiencia')).toBeInTheDocument()
      expect(screen.getByText('Enviar')).toBeInTheDocument()
    })
  })

  it('actualiza la puntuación al hacer click en las estrellas', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByText('Enviar')).toBeInTheDocument()
    })

    const estrellas = screen.getAllByAltText(/Estrella/i)
    await userEvent.click(estrellas[2]) // Click en estrella 3

    // Verificar que el botón ya no está deshabilitado (puntuación > 0)
    const botonEnviar = screen.getByText('Enviar').closest('button')
    expect(botonEnviar).not.toBeDisabled()
  })

  it('actualiza el comentario al escribir en el textarea', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Contanos tu experiencia')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Contanos tu experiencia')
    await userEvent.type(textarea, 'Excelente servicio')

    expect(textarea).toHaveValue('Excelente servicio')
  })

  it('envía la calificación exitosamente', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)
    vi.mocked(calificacionesService.calificar).mockResolvedValue(CALIFICACION_RESPONSE_MOCK)

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByText('Enviar')).toBeInTheDocument()
    })

    // Seleccionar puntuación
    const estrellas = screen.getAllByAltText(/Estrella/i)
    await userEvent.click(estrellas[4]) // Click en estrella 5

    // Escribir comentario
    const textarea = screen.getByPlaceholderText('Contanos tu experiencia')
    await userEvent.type(textarea, 'Muy bueno')

    // Enviar
    const botonEnviar = screen.getByText('Enviar')
    await userEvent.click(botonEnviar)

    await waitFor(() => {
      expect(calificacionesService.calificar).toHaveBeenCalledWith(123, {
        localId: 1,
        puntuacion: 5,
        comentario: 'Muy bueno'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/calificaciones')
    })
  })

  it('muestra error cuando falla la carga del local', async () => {
    vi.mocked(localService.getLocal).mockRejectedValue(new Error('404 Not Found'))

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByText('404 Not Found')).toBeInTheDocument()
      expect(screen.getByText('Volver')).toBeInTheDocument()
    })
  })

 
  it('muestra error cuando no hay usuario autenticado al enviar', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)
    // Configurar para retornar 123 durante el render
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(123)

    render(<CalificarLocal />)

    await waitFor(() => {
      expect(screen.getByText('Enviar')).toBeInTheDocument()
    })

   
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(null)

    const estrellas = screen.getAllByAltText(/Estrella/i)
    await userEvent.click(estrellas[4])

    const botonEnviar = screen.getByText('Enviar')
    await userEvent.click(botonEnviar)

    await waitFor(() => {
      expect(screen.getByText('No se ha iniciado sesión')).toBeInTheDocument()
    })
  })

  it('navega a calificaciones cuando no hay id en params', async () => {
    mockUseParams = () => ({})
    render(<CalificarLocal />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/calificaciones')
    })
  })

  it('deshabilita el botón enviar cuando la puntuación es 0', async () => {
    vi.mocked(localService.getLocal).mockResolvedValue(LOCAL_COMPLETO_MOCK)

    render(<CalificarLocal />)

    await waitFor(() => {
      const botonEnviar = screen.getByText('Enviar').closest('button')
      expect(botonEnviar).toBeDisabled()
    })
  })
})