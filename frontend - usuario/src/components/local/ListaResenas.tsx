import { useOutletContext } from 'react-router-dom'
import { ResenaLocal } from './ResenaLocal'
import type { LocalCompleto } from '../../models/localModels'

export const ListaResenas = () => {
  const { local } = useOutletContext<{ local: LocalCompleto }>()

  return (
    <>
      {local.resenas.map((resena) => (
        <ResenaLocal {...resena} key={resena.idResena} />
      ))}
      
      {local.resenas.length == 0
        ? 'El local no tiene reseñas por ahora.'
        : ''}
    </>
  )
}
