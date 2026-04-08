import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Home } from '../../pages/Home'
import { homeService } from '../../services/homeService'
import { authService } from '../../services/AuthService'

// Mocks de services
vi.mock('../../services/homeService', () => ({
    homeService: {
        getAll: vi.fn(),
        getFiltered: vi.fn()
    }
}))

vi.mock('../../services/AuthService', () => ({
    authService: {
        estaAutenticado: vi.fn(),
        obtenerIdUsuarioActual: vi.fn()
    }
}))

// Mock de router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await vi.importActual<any>('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// los locales
const LOCALES_MOCK = [
    {
        id: 1,
        nombre: 'Pizza Palace',
        direccion: 'Av. Corrientes',
        altura: 1234,
        img: 'foto1',
        cercano: true
    },
    {
        id: 2,
        nombre: 'Burger King',
        direccion: 'Av. Santa Fe',
        altura: 2500,
        img: 'foto2',
        cercano: false
    }
]

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(authService.estaAutenticado).mockReturnValue(true)
    })

    // carga inicial ok
    it('muestra los locales al cargar la página', async () => {
        vi.mocked(homeService.getAll).mockResolvedValue(LOCALES_MOCK)

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // esperoa que aparezcan ambos locales
        await waitFor(() => {
            expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
            expect(screen.getByText('Burger King')).toBeInTheDocument()
        })

        expect(homeService.getAll).toHaveBeenCalledTimes(1)
    })

    // carga inicial sin locales para ver si aparece el <p>
    it('muestra mensaje cuando no hay locales', async () => {
        vi.mocked(homeService.getAll).mockResolvedValue([])

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('no-locales-message')).toBeInTheDocument()
        })

        expect(screen.getByText('No se encontraron locales.')).toBeInTheDocument()
    })

    // búsqueda ok
    it('muestra locales filtrados al buscar', async () => {
        vi.mocked(homeService.getAll).mockResolvedValue(LOCALES_MOCK)
        vi.mocked(homeService.getFiltered).mockResolvedValue([LOCALES_MOCK[0]]) // Solo Pizza

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        // Esperar a que cargue inicialmente
        await waitFor(() => {
            expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
        })

        // Simular búsqueda
        const input = screen.getByTestId('search-input')
        await userEvent.type(input, 'pizza')

        // Esperar el debounce (250)
        await waitFor(
            () => {
                expect(homeService.getFiltered).toHaveBeenCalledWith('pizza', false)
            },
            { timeout: 1000 }
        )

        // Verificar que solo se muestra Pizza Palace
        await waitFor(() => {
            expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
            expect(screen.queryByText('Burger King')).not.toBeInTheDocument()
        })
    })

    // búsqueda sin resultados
    it('muestra mensaje cuando la búsqueda no encuentra locales', async () => {
        vi.mocked(homeService.getAll).mockResolvedValue(LOCALES_MOCK)
        vi.mocked(homeService.getFiltered).mockResolvedValue([])

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
        })

        // acá busco algo que no está y esperaría que salte el <p>
        const input = screen.getByTestId('search-input')
        await userEvent.type(input, 'sushi')

        await waitFor(
            () => {
                expect(homeService.getFiltered).toHaveBeenCalledWith('sushi', false)
            },
            { timeout: 1000 }
        )

        await waitFor(() => {
            expect(screen.getByTestId('no-locales-message')).toBeInTheDocument()
        })
    })

    // checkbox "solo cercanos"
    it('filtra por locales cercanos al marcar el checkbox', async () => {
        vi.mocked(homeService.getAll).mockResolvedValue(LOCALES_MOCK)
        vi.mocked(homeService.getFiltered).mockResolvedValue([LOCALES_MOCK[0]])

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
        })

        // Marcar checkbox
        const checkbox = screen.getByTestId('search-checkbox')
        await userEvent.click(checkbox)

        await waitFor(() => {
            expect(homeService.getFiltered).toHaveBeenCalledWith('', true)
        })
    })
})