import volverIcon from '../assets/icons/arrow-left.svg'
import { Boton } from '../components/Boton'
import { Tabs, type Tab } from '../components/Tabs'
import { Header } from '../components/Header'
import { InfoLocal } from '../components/local/InfoLocal'
import { useState } from 'react'
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Pedido } from '../classes/Pedido'
import type { Plato } from '../models/platoModel'
import { useOnInit } from '../utils/hooks'
import { localService } from '../services/localService'
import { getMensajeError, type ErrorCustom, type ErrorResponse } from '../utils/errorHandling'
import { ErrorCard } from '../components/ErrorCard'
import { Spinner } from '../components/Spinner'
import { OutletContextType } from '../layouts/PedidoLayout'
import { LocalCompleto } from '../models/localModels'

export const PerfilLocal = () => {
  /* Vista y navegacion */
  const [platos, setPlatos] = useState<Plato[] | null>(null)
  const [local, setLocal] = useState<LocalCompleto>()
  const [activeTab, setActiveTab] = useState('menu')
  const navigate = useNavigate()
  const { id } = useParams()

  /* Manejo del pedido */
  const { pedido, setPedido } = useOutletContext<OutletContextType>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorCustom | null>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    navigate(tab)
  }

  const getLocal = async () => {
    /* la primer navegacion de la subruta siempre tiene que ir a menu */
    /* tanto /perfil-local/3 */
    /* como /perfil-local/3/resenas */
    /* 2 fix en 1 linea */
    navigate(`/perfil-local/${id}/menu`)
    try {
      const local = await localService.getLocal(Number(id))
      const platos = await localService.getPlatosLocal(Number(id))
      setLocal(local)
      setPlatos(platos)
      if (!pedido || pedido.local?.id !== Number(id)) {
        /* si no tengo pedido o el pedido es de otro local, seteo uno 0km */
        const pedidoVacio = new Pedido()
        const pedidoConLocal = pedidoVacio.agregarLocal(local)
        setPedido(pedidoConLocal)
      }
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(getLocal)

  const tabsLocal: Tab[] = [
    { id: 'menu', label: 'Menú' },
    { id: 'resenas', label: 'Reseñas' }
  ]

  if (loading) return <Spinner />

  if (error)
    return (
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onVolver={() => navigate('/home')}
      />
    )

  return (
    <section className="flex flex-col bg-white font-sans w-full">
      {/* Aca podia haber usado pedido.local directamente y omitir el estado del local pero me hacia ruido y preferi dejarlo asi */}
      <Header icon={volverIcon} label={local!.nombre} route="/home" />
      <InfoLocal local={local!} />
      <Tabs tabs={tabsLocal} active={activeTab} onChange={handleTabChange} />
      <div className="flex flex-col gap-6 px-4 my-7">
        {/* ListaResenas o ListaPlatos */}
        <Outlet context={{ pedido, setPedido, platos, local }} />
      </div>
      <div className="mx-3 my-5">
        {pedido.totalItems() > 0 && (
          <Boton tipo="primario" onClick={() => navigate('/checkout')}>
            Ver Pedido ({pedido.totalItems()})
          </Boton>
        )}
      </div>
    </section>
  )
}
