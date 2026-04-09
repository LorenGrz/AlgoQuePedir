import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../Header'
import { Boton } from '../Boton'
import xIcon from '../../assets/icons/x.svg'
import starIcon from '../../assets/icons/star.svg'
import starFillIcon from '../../assets/icons/star-fill.svg'
import { getMensajeError } from '../../utils/errorHandling'
import { localService } from '../../services/localService'
import { useOnInit } from '../../utils/hooks'
import { calificacionesService } from '../../services/calificacionesService'
import { authService } from '../../services/AuthService'
import { LocalCalificacion } from '../../models/localModels'
import { toCalificacionRequest, toLocalCalificacion } from '../../classes/LocalMapper'
import { toast } from 'react-toastify'

export const CalificarLocal = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [localData, setLocalData] = useState<LocalCalificacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TRAIGO EL LOCAL Y CARGO SU ESTADO
  const traerLocal = async () => {
    if (!id) {
      navigate('/calificaciones')
      return
    }

    try {
      setLoading(true)
      const localCompleto = await localService.getLocal(Number(id))

      // Usar la función mapper para convertir el local completo en un estado local
      const localCalificacion = toLocalCalificacion(localCompleto, Number(id))
      setLocalData(localCalificacion)
    } catch (err) {
      const errorResponse = getMensajeError(err)
      setError(errorResponse.message)
      console.error('Error cargando local:', err)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(traerLocal)

  //PUNTAJE
  const handleStarClick = (index: number) => {
    if (!localData) return
    setLocalData({ ...localData, puntuacion: index + 1 })
  }

  //ENVIAR CALIFICACION AL BACKEND
  const handleSubmit = async () => {
    if (!id || !localData) return

    const usuarioId = authService.obtenerIdUsuarioActual()
    if (!usuarioId) {
      setError('No se ha iniciado sesión')
      return
    }

    // Usar la función mapper para convertir el estado local en un payload para enviar al backend
    const payload = toCalificacionRequest(localData, Number(id))

    try {
      const data = await calificacionesService.calificar(usuarioId, payload)

      if (data.ok) {
        // Usar el mensaje del backend si existe, sino uno por defecto
        const mensaje = data.mensaje || 'Calificación exitosa'
        toast.success(mensaje)

        navigate('/calificaciones')

      } else {
        const mensajeError = data.mensaje || 'No se pudo enviar la calificación'
        toast.error(mensajeError)
      }
    } catch (err) {
      const errorResponse = getMensajeError(err)
      toast.error(errorResponse.message)
    }
  }

  //MANEJO DE ERRORES Y CARGANDO
  if (loading) {
    return (
      <section className="flex flex-col bg-white font-sans w-full h-[calc(100vh-5rem)] overflow-hidden">
        <Header icon={xIcon} label="Calificar" />
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </section>
    )
  }

  if (error || !localData) {
    return (
      <section className="flex flex-col bg-white font-sans w-full h-[calc(100vh-5rem)] overflow-hidden">
        <Header icon={xIcon} label="Calificar" />
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <p className="text-red-600 text-center mb-4">
            {error || 'No se pudo cargar la información del local'}
          </p>
          <Boton tipo="primario" onClick={() => navigate('/calificaciones')}>
            Volver
          </Boton>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col bg-white font-sans w-full h-[calc(100vh-5rem)] overflow-hidden">
      <Header icon={xIcon} label="Calificar" />

      <div className="flex flex-col px-4 py-3 flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Cómo fue tu experiencia con {localData.localNombre}?
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Tu opinión ayuda a otros a elegir el mejor lugar
          </p>

          {/* Estrellas */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStarClick(index)}
                  className="p-1 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={localData.puntuacion > index ? starFillIcon : starIcon}
                    alt={`Estrella ${index + 1}`}
                    className="w-10 h-10"
                  />
                </button>
                <span className="text-xs text-gray-400 mt-1">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Textarea para comentario */}
        <div className="mb-3">
          <textarea
            value={localData.comentario}
            onChange={(e) => setLocalData({ ...localData, comentario: e.target.value })}
            placeholder="Contanos tu experiencia"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-shrink-0 pt-2 pb-2">
          <Boton tipo="primario" onClick={handleSubmit} disabled={localData.puntuacion === 0}>
            Enviar
          </Boton>
        </div>
      </div>
    </section>
  )
}
