import { useState } from 'react'
import { useOnInit } from '../../utils/hooks'
import { Ingrediente } from '../../models/ingredienteModel'
import { ingredienteService } from '../../services/ingredienteService'
import { getMensajeError } from '../../utils/errorHandling'
import type { ErrorResponse } from 'react-router-dom'
import { Usuario } from '../../classes/usuario/Usuario'
import { toast } from 'react-toastify'

type Props = {
  seleccionar: (ing: Ingrediente) => void
  onClose: () => void
  usuario: Usuario
  isPreferidos: boolean
}

export const ModalIngredientes = ({ seleccionar, onClose, usuario, isPreferidos }: Props) => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])

  useOnInit(async () => {
    try {
      const response = await ingredienteService.getIngredintes()
      setIngredientes(usuario.mostrarIngredientes(response, isPreferidos))
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      toast.error(errorMessage.message)
      onClose()
    }
  })

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-end sm:items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-md max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-lg p-4 animate-slide-up transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 py-3">
          Clickee los ingredientes que quiera agregar a la lista
        </p>
        {ingredientes.map((ing) => (
          <div
            onClick={() => seleccionar(ing)}
            key={`all-ing-${ing.id}-${ing.nombre}`}
            className="flex justify-center p-2 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {ing.nombre}
          </div>
        ))}
      </div>
    </div>
  )
}
