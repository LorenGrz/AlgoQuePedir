import { useState } from 'react'
import type { Plato } from '../../models/platoModel'
import { PlatoMenu } from './PlatoMenu'
import { ModalPlato } from './ModalPlato'
import { Pedido } from '../../classes/Pedido'
import { useOutletContext } from 'react-router-dom'

export const ListaPlatos = () => {
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null)
  const { pedido, setPedido, platos } = useOutletContext<{
    pedido: Pedido
    setPedido: (pedido: Pedido) => void
    platos: Plato[]
  }>()

  const handleOpenModal = (plato: Plato) => setSelectedPlato(plato)

  const handleCloseModal = () => {
    setSelectedPlato(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      {platos.map((plato) => (
        <div key={plato.id} onClick={() => handleOpenModal(plato)} className="cursor-pointer">
          <PlatoMenu {...plato} key={plato.id} />
        </div>
      ))}

      {platos.length == 0 ? 'El local elegido no tiene para ofrecer platos acordes a su preferencia.' : ''}

      {selectedPlato && (
        <ModalPlato
          plato={selectedPlato}
          pedido={pedido}
          onClose={handleCloseModal}
          setPedido={setPedido}
        />
      )}
    </>
  )
}
