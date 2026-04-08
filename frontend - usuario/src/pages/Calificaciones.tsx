import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { LocalCard } from '../components/calificaciones/LocalCard'
import type { LocalResumen } from '../models/localModels'
import { useState } from 'react'
import { calificacionesService } from '../services/calificacionesService'
import { getMensajeError } from '../utils/errorHandling'
import { useOnInit } from '../utils/hooks.ts'
import { authService } from '../services/AuthService'

export const Calificaciones = () => {
  const navigate = useNavigate()
  const [locales, setLocales] = useState<LocalResumen[]>([])
  const [error, setError] = useState<string>('')

  const cargarLocalesPendientes = async () => {
    try {
      const usuarioId = authService.obtenerIdUsuarioActual()
      
      if (!usuarioId) {
        setError('No se ha iniciado sesión')
        navigate('/auth/login')
        return
      }

      const data = await calificacionesService.traerLocalesPendientes(usuarioId)
      setLocales(data)
    } catch (error) {
      const errorResponse = getMensajeError(error)
      setError(errorResponse.message)
      console.error('Error cargando locales pendientes:', error)
    }
  }

  useOnInit(cargarLocalesPendientes)

    const handleCalificar = (local: LocalResumen) => {
      navigate(`/calificarlocal/${local.id}`)
    }

  return (
    <section className="flex flex-col bg-white font-sans w-full min-h-screen">
      <Header label="Restaurantes a calificar" />
      <div className="flex flex-col">
        {error && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {locales.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-gray-500 text-center">
              No hay restaurantes disponibles para calificar
            </p>
          </div>
        ) : (
          locales.map((local) => (
            <LocalCard key={local.id} local={local} onCalificar={() => handleCalificar(local)} />
          ))
        )}
      </div>
    </section>
  )
}