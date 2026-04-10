import React from 'react'
import { useState } from 'react'
import { HeaderHome } from '../components/home/HeaderHome'
import { SearchBar } from '../components/home/SearchBar'
import { homeService } from '../services/homeService'
import type { CardHome } from '../models/localModels'
import { useOnInit } from '../utils/hooks'
import { getMensajeError, type ErrorCustom } from '../utils/errorHandling'
import type { ErrorResponse } from 'react-router-dom'
import { ErrorCard } from '../components/ErrorCard'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthService'

const LocalCard = React.lazy(() => import('../components/home/CardLocal'))

export const Home = () => {
  const navigate = useNavigate()
  const [locales, setLocales] = useState<CardHome[]>([])
  const [error, setError] = useState<ErrorCustom | null>(null)

  const getLocales = async () => {
    try {
      const response = await homeService.getAll()
      setLocales(response)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    }
  }
  useOnInit(getLocales)

  const handleSearch = async (texto: string, soloCercanos: boolean) => {
    try {
      if (!authService.estaAutenticado()) {
        navigate('/auth/login')
      }
      const data = await homeService.getFiltered(texto, soloCercanos)
      setLocales(data)
      setError(null)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    }
  }
  if (error)      // Elimino esto? en caso de error con localStorage uso navigate
    return (
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onVolver={() => navigate(-1)}
      />
    )
  return (
    <section data-testid="home-container" className="flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300 min-h-screen font-sans">
      <HeaderHome label="Delivery" />
      <SearchBar onSearch={handleSearch} />
      <div className="px-4 mt-2">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Locales de comidas</h2>

        <React.Suspense fallback={<p>Cargando locales...</p>}>
          <div data-testid="locales-list" className="flex flex-wrap justify-between gap-y-4">
            {locales.length > 0 ? (
              locales.map((local) => (
                <LocalCard
                  key={local.id}
                  id={local.id}
                  nombre={local.nombre}
                  direccion={local.direccion}
                  altura={local.altura}
                  imagen={local.img}
                  esCercano={local.cercano}
                />
              ))
            ) : (
              <p data-testid="no-locales-message" className="text-sm text-gray-500 text-center w-full">No se encontraron locales.</p>
            )}
          </div>
        </React.Suspense>
      </div>
    </section>
  )
}
