import React, { useState } from 'react'
import { ComportamientoErrors, Marketinero } from '../../classes/usuario/UsuarioComportamiento'
import xIcon from '../../assets/icons/x.svg'
import { INPUT_CLASES_STYLE } from '../../classes/usuario/Constants'
import { TipoDietaEnum } from '../../models/usuarioModel'

type Props = {
  criterio: Marketinero
  errors: ComportamientoErrors
  setErrors: React.Dispatch<React.SetStateAction<ComportamientoErrors>>
}

export const CriterioMarketinero = ({criterio, errors, setErrors}: Props) => {
  const [inputPalabras, setInputPalabras] = useState<string>('')
  const [palabras, setPalabras] = useState<string[]>(criterio.palabrasClave)
  
  // -------- Handler --------
  const agregarPalabra = () => {
    if (!inputPalabras.trim()) {
      setErrors({ ...errors, [TipoDietaEnum.MARKETINERO]: 'Ingrese una palabra'} )
      return
    }
    setErrors({ ...errors, [TipoDietaEnum.MARKETINERO]: ''} )
    criterio.agregarItem(inputPalabras)
    setPalabras(criterio.palabrasClave)
    setInputPalabras('')
  }

  const eliminarPalabra = (palabra: string) => {
    criterio.eliminarItem(palabra)
    setPalabras(criterio.palabrasClave)
  }
  
  // -------- Contenido HTML --------
  return (
    <div className="my-2">
      {palabras.map((palabra) => (
        <div key={`mkt-${palabra}`} className="cursor-pointer flex w-full justify-between py-2 text-gray-500">
          {palabra}
          <img src={xIcon} alt="Eliminar" onClick={() => {eliminarPalabra(palabra)}}/>
        </div>
      ))}

      <div className="flex justify-between">
        <input
          name="agregarP"
          type="text"
          value={inputPalabras}
          className={INPUT_CLASES_STYLE}
          onChange={(e) => {setInputPalabras(e.target.value)}}
        />
        <button onClick={() => agregarPalabra()}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
        >
          +
        </button>
      </div>
    </div>
  )
}
