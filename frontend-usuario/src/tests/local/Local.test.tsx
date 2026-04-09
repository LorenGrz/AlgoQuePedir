import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PerfilLocal } from '../../pages/PerfilLocal'
import userEvent from '@testing-library/user-event'
import { ListaPlatos } from '../../components/local/ListaPlatos'
import { useOutletContext } from 'react-router-dom'
import { ListaResenas } from '../../components/local/ListaResenas'
import { RESENAS_MOCK } from '../../mocks/LocalMock'

/* El linter no te chifla cuando la ruta de vi.mock no coincide con el import...
Solamente te dice: Property 'mockResolvedValue' does not exist
He gritado mucho. Mockeen instantaneamente despues de importar para no gritar como yo. Abz. */
import { localService } from '../../services/localService'
vi.mock('../../services/localService', () => ({
  localService: {
    getLocal: vi.fn(),
    getPlatosLocal: vi.fn()
  }
}))

vi.mock('react-router-dom', async () => {
  /* Como carajo tipo esto para no clavarle un any */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useOutletContext: vi.fn()
  }
})

/* No puedo usar los mocks de /mocks porque las rutas relativas de las imagenes no las encuentra */
const PLATOS_MOCK = [
  { id: 1, nombre: 'Pizza Margherita', descripcion: 'asd', img: 'x', precio: 10, popular: true },
  { id: 2, nombre: 'Hamburguesa', descripcion: 'qwe', img: 'y', precio: 12, popular: false }
]

const localMock = () => {
  vi.mocked(localService.getLocal).mockResolvedValue({
    id: 4,
    nombre: 'Restaurante Italiano',
    puntajeTotal: 4.5,
    totalVentas: 546,
    resenas: [],
    img: 's',
    distanciaKm: 10,
    envioGratis: true,
    metodosDePago: ['EFECTIVO', 'QR']
  })
}

describe('PerfilLocal', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useOutletContext).mockReturnValue({
      pedido: { idLocal: 4, totalItems: () => 2 },
      setPedido: vi.fn(),
      platos: PLATOS_MOCK,
      local: { resenas: RESENAS_MOCK },
      setLocal: vi.fn()
    })
  })

  /* Testeo loading */
  it('muestra spinner cuando getLocal todavía no se resolvió', async () => {
    render(<PerfilLocal />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  /* Testeo render del local con el fetch mockeado */
  it('muestra la info del local correctamente cuando se resuelve getLocal', async () => {
    localMock()

    render(<PerfilLocal />)

    await waitFor(() => expect(screen.getByTestId('nombre-local')).toBeInTheDocument())
    await waitFor(() =>
      expect(screen.getByTestId('verPedidoBoton')).toHaveTextContent('Ver Pedido (2)')
    )
  })

  /* Testeo render de error en fetch */
  it('muestra error si el fetch falla', async () => {
    vi.mocked(localService.getLocal).mockRejectedValue(new Error('500'))

    render(<PerfilLocal />)

    await waitFor(() => expect(screen.getByText(/Reintentar/i)).toBeInTheDocument())
  })

  /* Testeo de tabs (podría ir en otro archivo Tabs.test.tsx) */
  it('cambia de tab', async () => {
    /* Arrange */
    localMock()

    /* Act */
    render(<PerfilLocal />)

    const tab = await waitFor(() => screen.getByText('Reseñas'))
    /* Assert */
    expect(tab).toHaveClass('text-gray-400')

    /* Act */
    await userEvent.click(tab)

    /* Assert */
    expect(tab).toHaveClass('border-red-600') // pasa a estar activo
  })

  /* Testeo render de lista de platos */
  it('muestra la info de los platos cuando se resuelve getLocalPlatos', async () => {
    render(<ListaPlatos />)

    expect(screen.getByTestId('plato-1')).toBeInTheDocument()
    expect(screen.getByTestId('plato-2')).toBeInTheDocument()
  })

  /* Testeo render de lista de resenas */
  it('muestra la info de las resenas cuando se resuelve getLocal', async () => {
    render(<ListaResenas />)

    expect(screen.getByTestId('resena-1')).toBeInTheDocument()
    expect(screen.getByTestId('resena-2')).toBeInTheDocument()
  })
})
