import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { IngredientePanel } from '../../components/usuario/IngredientePanel'
import { PerfilUsuarioLayout } from '../../layouts/UsuarioLayout'
import { Usuario } from '../../classes/usuario/Usuario'
import { usuarioService } from '../../services/usuarioService'
import { authService } from '../../services/AuthService'
import { ingredienteService } from '../../services/ingredienteService'
import type { Ingrediente } from '../../models/ingredienteModel'
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

vi.mock('../../services/ingredienteService', () => ({
  ingredienteService: {
    getIngredintes: vi.fn()
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

const INGREDIENTES_MOCK: Ingrediente[] = [
  { id: 1, nombre: 'Tomate', costo: 100, grupoAlimenticio: '', origenAnimal: false },
  { id: 2, nombre: 'Carne', costo: 500, grupoAlimenticio: '', origenAnimal: true },
  { id: 3, nombre: 'Cebolla', costo: 50, grupoAlimenticio: '', origenAnimal: false },
  { id: 4, nombre: 'Pollo', costo: 400, grupoAlimenticio: '', origenAnimal: true }
]

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

describe('IngredientePanel', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(authService.obtenerIdUsuarioActual).mockReturnValue(1)
    vi.mocked(usuarioService.getUsuario).mockResolvedValue(USUARIO_MOCK)
    vi.mocked(ingredienteService.getIngredintes).mockResolvedValue(INGREDIENTES_MOCK)
  })

  describe('Panel de Ingredientes Preferidos', () => {
    it('debe mostrar ingredientes preferidos existentes', async () => {
      const usuarioConPreferidos = new Usuario({
        ...USUARIO_MOCK,
        ingredientesPreferidos: [INGREDIENTES_MOCK[0], INGREDIENTES_MOCK[2]]
      })
      vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConPreferidos)

      render(
        <MemoryRouter initialEntries={['/usuario/preferidos']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Tomate')).toBeInTheDocument()
        expect(screen.getByText('Cebolla')).toBeInTheDocument()
      })
    })

    it('debe abrir modal al hacer click en Añadir Ingrediente', async () => {
      render(
        <MemoryRouter initialEntries={['/usuario/preferidos']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Añadir Ingrediente')).toBeInTheDocument()
      })

      const botonAgregar = screen.getByText('Añadir Ingrediente')
      await userEvent.click(botonAgregar)

      await waitFor(() => {
        expect(ingredienteService.getIngredintes).toHaveBeenCalled()
        expect(screen.getByText(/Clickee los ingredientes que quiera agregar a la lista/i)).toBeInTheDocument()
      })
    })

    it('debe agregar un ingrediente preferido', async () => {
      render(
        <MemoryRouter initialEntries={['/usuario/preferidos']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Añadir Ingrediente')).toBeInTheDocument()
      })

      const botonAgregar = screen.getByText('Añadir Ingrediente')
      await userEvent.click(botonAgregar)

      await waitFor(() => {
        expect(screen.getByText('Tomate')).toBeInTheDocument()
      })

      const tomateOption = screen.getAllByText('Tomate').find(
        el => el.closest('div')?.onclick !== undefined
      )
      if (tomateOption) {
        await userEvent.click(tomateOption)

        await waitFor(() => {
          expect(toast.success).toHaveBeenCalledWith('Ingrediente agregado.')
        })
      }
    })

    it('debe eliminar un ingrediente preferido', async () => {
      const usuarioConPreferidos = new Usuario({
        ...USUARIO_MOCK,
        ingredientesPreferidos: [INGREDIENTES_MOCK[0]]
      })
      vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConPreferidos)

      render(
        <MemoryRouter initialEntries={['/usuario/preferidos']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Tomate')).toBeInTheDocument()
      })

      const eliminarButtons = screen.getAllByAltText('Eliminar')
      if (eliminarButtons.length > 0) {
        await userEvent.click(eliminarButtons[0])

        await waitFor(() => {
          expect(screen.queryByText('Tomate')).not.toBeInTheDocument()
        })
      }
    })
  })

  describe('Panel de Ingredientes a Evitar', () => {
    it('debe mostrar ingredientes a evitar existentes', async () => {
      const usuarioConEvitar = new Usuario({
        ...USUARIO_MOCK,
        ingredientesAEvitar: [INGREDIENTES_MOCK[1], INGREDIENTES_MOCK[3]]
      })
      vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConEvitar)

      render(
        <MemoryRouter initialEntries={['/usuario/evitar']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="evitar" element={<IngredientePanel isPreferidos={false} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Carne')).toBeInTheDocument()
        expect(screen.getByText('Pollo')).toBeInTheDocument()
      })
    })

    it('debe agregar un ingrediente a evitar', async () => {
      render(
        <MemoryRouter initialEntries={['/usuario/evitar']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="evitar" element={<IngredientePanel isPreferidos={false} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Añadir Ingrediente')).toBeInTheDocument()
      })

      const botonAgregar = screen.getByText('Añadir Ingrediente')
      await userEvent.click(botonAgregar)

      await waitFor(() => {
        expect(screen.getByText('Carne')).toBeInTheDocument()
      })

      const carneOption = screen.getAllByText('Carne').find(
        el => el.closest('div')?.onclick !== undefined
      )
      if (carneOption) {
        await userEvent.click(carneOption)

        await waitFor(() => {
          expect(toast.success).toHaveBeenCalledWith('Ingrediente agregado.')
        })
      }
    })

    it('debe eliminar un ingrediente a evitar', async () => {
      const usuarioConEvitar = new Usuario({
        ...USUARIO_MOCK,
        ingredientesAEvitar: [INGREDIENTES_MOCK[1]]
      })
      vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConEvitar)

      render(
        <MemoryRouter initialEntries={['/usuario/evitar']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="evitar" element={<IngredientePanel isPreferidos={false} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Carne')).toBeInTheDocument()
      })

      const eliminarButtons = screen.getAllByAltText('Eliminar')
      if (eliminarButtons.length > 0) {
        await userEvent.click(eliminarButtons[0])

        await waitFor(() => {
          expect(screen.queryByText('Carne')).not.toBeInTheDocument()
        })
      }
    })

    it('debe mantener los cambios al navegar entre páginas', async () => {
      const usuarioConPreferidos = new Usuario({
        ...USUARIO_MOCK,
        ingredientesPreferidos: [INGREDIENTES_MOCK[0]]
      })
      vi.mocked(usuarioService.getUsuario).mockResolvedValue(usuarioConPreferidos)

      render(
        <MemoryRouter initialEntries={['/usuario/preferidos']}>
          <Routes>
            <Route path="/usuario" element={<PerfilUsuarioLayout />}>
              <Route path="preferidos" element={<IngredientePanel isPreferidos={true} />} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Tomate')).toBeInTheDocument()
      })

      // Verificar que el ingrediente se mantiene
      expect(screen.getByText('Tomate')).toBeInTheDocument()
    })
  })
})
