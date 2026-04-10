import React, { useState } from 'react'
import { LocalData } from '../LocalData'
import { Fiel } from '../../classes/usuario/UsuarioComportamiento'
import { ModalLocales } from './ModalLocales'
import { LocalResumen } from '../../models/localModels'
import { toast } from 'react-toastify'

type Props = {
  criterio: Fiel
}

export const CriterioLocales = ({criterio}: Props) => {
  const [showLocalesModal, setShowLocalesModal] = useState<boolean>(false)
  const [locales, setLocales] = useState<LocalResumen[]>(criterio.localesPreferidos)

  // -------- Handler --------
  const agregarLocal= (local: LocalResumen) => {
    criterio.agregarItem(local)
    toast.success('Local agregado con exito.')
    setLocales(criterio.localesPreferidos)
  }

  const eliminarLocal= (local: LocalResumen) => {
    criterio.eliminarItem(local)
    setLocales(criterio.localesPreferidos)
  }

  // -------- Contenido HTML --------
  return (
    <div className="my-2">
      {locales.map((local) => (
        <LocalData key={`lc-pref-${local.id}-${local.nombre}`} local={local} eliminar={() => {eliminarLocal(local)}}></LocalData>
      ))}

      <div className="flex justify-end">
        <button onClick={() => {setShowLocalesModal(true)}}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
        >
            +
        </button>
      </div>

      {showLocalesModal && <ModalLocales seleccionar={(local) => {agregarLocal(local)}} onClose={() => setShowLocalesModal(false)}></ModalLocales>}
    </div>
  )
}
