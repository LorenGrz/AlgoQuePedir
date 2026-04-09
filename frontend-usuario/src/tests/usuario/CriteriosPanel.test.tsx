import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CriteriosPanel } from '../../components/usuario/CriteriosPanel'
import { PerfilUsuarioLayout } from '../../layouts/UsuarioLayout'
import { Usuario } from '../../classes/usuario/Usuario'
import { usuarioService } from '../../services/usuarioService'
import { authService } from '../../services/AuthService'
import { TipoDietaEnum } from '../../models/usuarioModel'

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

describe('CriteriosPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(1)
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)
  })

  it('debe seleccionar múltiples criterios', async () => {
    render(
      <MemoryRouter initialEntries={['/usuario/criterios']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="criterios" element={<CriteriosPanel />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Veganos')).toBeInTheDocument()
    })

    // Buscar por name attribute
    const checkboxes = screen.getAllByRole('checkbox')
    const vegano = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.VEGANO)
    const exquisito = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.EXQUISITO)
    const conservador = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.CONSERVADOR)

    if (vegano && exquisito && conservador) {
      await userEvent.click(vegano)
      await userEvent.click(exquisito)
      await userEvent.click(conservador)

      await waitFor(() => {
        expect(vegano).toBeChecked()
        expect(exquisito).toBeChecked()
        expect(conservador).toBeChecked()
      })
    }
  })

  it('debe cambiar la distancia para Impacientes', async () => {
    render(
      <MemoryRouter initialEntries={['/usuario/criterios']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="criterios" element={<CriteriosPanel />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Impacientes')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const checkboxImpaciente = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.IMPACIENTE)
    
    if (checkboxImpaciente) {
      await userEvent.click(checkboxImpaciente)

      await waitFor(() => {
        expect(screen.getByText('Distancia (kms)')).toBeInTheDocument()
      })

      const botonMas = screen.getByText('+').closest('span')
      const botonMenos = screen.getByText('-').closest('span')

      if (botonMas && botonMenos) {
        await userEvent.click(botonMas)
        await waitFor(() => {
          expect(screen.getByText('2')).toBeInTheDocument()
        })

        await userEvent.click(botonMas)
        await waitFor(() => {
          expect(screen.getByText('3')).toBeInTheDocument()
        })

        await userEvent.click(botonMenos)
        await waitFor(() => {
          expect(screen.getByText('2')).toBeInTheDocument()
        })

        await userEvent.click(botonMenos)
        await waitFor(() => {
          expect(screen.getByText('1')).toBeInTheDocument()
        })

        // Verificar que no puede bajar de 1
        await userEvent.click(botonMenos)
        await waitFor(() => {
          expect(screen.getByText('1')).toBeInTheDocument()
        })
      }
    }
  })

  it('debe validar criterio Vegano con ingredientes de origen animal', async () => {
    const usuarioConIngredienteAnimal = new Usuario({
      ...USUARIO_MOCK,
      ingredientesPreferidos: [
        { id: 1, nombre: 'Carne', origenAnimal: true, costo: 0, grupoAlimenticio: '' }
      ]
    })
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConIngredienteAnimal)

    render(
      <MemoryRouter initialEntries={['/usuario/criterios']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="criterios" element={<CriteriosPanel />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Veganos')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const checkboxVegano = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.VEGANO)
    
    if (checkboxVegano) {
      await userEvent.click(checkboxVegano)

      await waitFor(() => {
        expect(checkboxVegano).toBeChecked()
      })

      const guardarButton = screen.getByText('Guardar')
      await userEvent.click(guardarButton)

      await waitFor(() => {
        expect(screen.getByText(/Existen ingredientes de origen animal en listado de Preferidos/i)).toBeInTheDocument()
      })
    }
  })

  it('debe validar criterio Fiel sin locales seleccionados', async () => {
    render(
      <MemoryRouter initialEntries={['/usuario/criterios']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="criterios" element={<CriteriosPanel />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Fieles')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const checkboxFiel = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.FIEL)
    
    if (checkboxFiel) {
      await userEvent.click(checkboxFiel)

      await waitFor(() => {
        expect(checkboxFiel).toBeChecked()
      })

      const guardarButton = screen.getByText('Guardar')
      await userEvent.click(guardarButton)

      await waitFor(() => {
        expect(screen.getByText(/Debés seleccionar al menos un local preferido/i)).toBeInTheDocument()
      })
    }
  })

  it('debe guardar criterios y navegar a perfil', async () => {
    render(
      <MemoryRouter initialEntries={['/usuario/criterios']}>
        <Routes>
          <Route path="/usuario" element={<PerfilUsuarioLayout />}>
            <Route path="criterios" element={<CriteriosPanel />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Veganos')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const checkboxVegano = checkboxes.find(cb => cb.getAttribute('name') === TipoDietaEnum.VEGANO)
    
    if (checkboxVegano) {
      await userEvent.click(checkboxVegano)

      await waitFor(() => {
        expect(checkboxVegano).toBeChecked()
      })

      const guardarButton = screen.getByText('Guardar')
      await userEvent.click(guardarButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/usuario/perfil')
      })
    }
  })
})
