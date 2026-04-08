import { Boton } from '../Boton'
import xIcon from '../../assets/icons/x.svg'
import type { Ingrediente } from '../../models/ingredienteModel'
import { useState } from 'react'
import { ModalIngredientes } from './ModalIngredientes'
import { useOutletContext } from 'react-router-dom'
import { UsuarioOutletContext } from '../../layouts/UsuarioLayout'
import { Header } from '../Header'
import volverIcon from '../../assets/icons/arrow-left.svg'
import { toast } from 'react-toastify'

type Props = {
  isPreferidos: boolean
}

export const IngredientePanel = ({isPreferidos}: Props) => {
  const { usuario, setUsuario } = useOutletContext<UsuarioOutletContext>()

  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(isPreferidos ? usuario.ingredientesPreferidos : usuario.ingredientesAEvitar)
  const [showModal, setShowModal] = useState<boolean>(false)


  // -------- Handler --------
    const eliminarIng = (ing: Ingrediente) => {
  
    if (isPreferidos){
      setIngredientes(usuario.eliminarIngPreferido(ing))
    } else {
      setIngredientes(usuario.eliminarIngEvitar(ing))
    }
    setUsuario(usuario)
  }

  const agregarIng = (ing: Ingrediente) => {
    usuario.agregarIng(ing, isPreferidos)
    toast.success('Ingrediente agregado.')
    setIngredientes(isPreferidos ? usuario.ingredientesPreferidos : usuario.ingredientesAEvitar)
    setUsuario(usuario)
  }

  // -------- Contenido HTML --------
  return (
    <div className="h-[calc(100dvh-5rem)] flex flex-col ">
      <Header label={isPreferidos ? 'Ingredientes preferidos' : 'Ingredientes a evitar'} icon={volverIcon}></Header>
    
      <div className='flex-1 overflow-hidden'>
        <section className="h-full overflow-y-auto px-6 py-4">
          <div>
            {/* se puede componentizar */}
            {ingredientes.map((ing) => (
              <div className="cursor-pointer flex w-full justify-between py-2 " key={`ing-${ing.id}-${ing.nombre}`}>
                {ing.nombre}
                <img src={xIcon} alt="Eliminar" onClick={() => eliminarIng(ing)} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-4  bg-white">
        <Boton tipo="primario" onClick={() => {setShowModal(true)}}>Añadir Ingrediente</Boton>
      </div>

      {showModal && <ModalIngredientes seleccionar={(ing) => {agregarIng(ing)}} onClose={() => {setShowModal(false)}} usuario={usuario} isPreferidos={isPreferidos} ></ModalIngredientes>}
    </div>
  )
}
