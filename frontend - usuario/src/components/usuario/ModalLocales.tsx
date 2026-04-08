import { useState } from 'react'
import { useOnInit } from '../../utils/hooks'
import { getMensajeError } from '../../utils/errorHandling'
import type { ErrorResponse } from 'react-router-dom'
import type { LocalResumen } from '../../models/localModels'
import { localService } from '../../services/localService'
import { LocalData } from '../LocalData'
import { toast } from 'react-toastify'

type Props = {
  seleccionar: (local: LocalResumen) => void
  onClose: () => void
}

export const ModalLocales = ({ onClose, seleccionar }: Props) => {
  const [locales, setLocales] = useState<LocalResumen[]>([])

  useOnInit(async () => {
    try {
      const response = await localService.getLocalesResumen()
      setLocales(response)
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
        className="bg-white w-full sm:max-w-md max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-lg p-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-gray-500 py-3">
          Clickee los Locales que quiera agregar a la lista
        </p>
        {locales.map((local) => (
          <LocalData
            onClick={() => seleccionar(local)}
            key={`all-lc-${local.id}-${local.nombre}`}
            local={local}
            mostrarIconoEliminar={false}
          ></LocalData>
        ))}
      </div>
    </div>
  )
}
