import { useState } from 'react'
import React from 'react'
import { Usuario } from '../classes/usuario/Usuario'
import { Spinner } from '../components/Spinner'
import { ErrorCard } from '../components/ErrorCard'
import { useOnInit } from '../utils/hooks'
import { getMensajeError, type ErrorCustom } from '../utils/errorHandling'
import { usuarioService } from '../services/usuarioService'
import { Outlet, useNavigate, type ErrorResponse } from 'react-router-dom'
import { authService } from '../services/AuthService'
import { toast } from "react-toastify";

export type UsuarioOutletContext = {
  usuario: Usuario
  setUsuario: React.Dispatch<React.SetStateAction<Usuario>>
  onSubmit: () => Promise<void>
}

export const PerfilUsuarioLayout = () => {
  const [usuario, setUsuario] = useState<Usuario>(new Usuario())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorCustom | null>(null)
  const navigate = useNavigate()

  // -------- oninit --------
  const getUsuario = async () => {
    try {
      const id = authService.obtenerIdUsuarioActual()
      if (!id) {
        navigate('/auth/login')
      } else {
        const response = await usuarioService.getUsuario(id)
        setUsuario(new Usuario(response))
      }
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  useOnInit(getUsuario)

  // -------- Submit --------
  const onSubmit = async () => {
    const usuarioValidado = usuario.validar()
    setUsuario(usuarioValidado)
    
    if (Object.keys(usuarioValidado.errors).length === 0){
      setLoading(true)
      try {
        const id = authService.obtenerIdUsuarioActual()

        if (!id) {
          navigate('/auth/login')
        } else {
          await usuarioService.actualizarUsusario(id, usuario)
          toast.success('Usuario Actualizado correctamente')
        }

      } catch (error) {
        const errorMessage = getMensajeError(error as ErrorResponse)
        toast.error(errorMessage.message)
      } finally {
        setLoading(false)
      }
    }
  }
  
  // -------- Contenido HTML --------
  if (loading) return <Spinner />
  
  if (error) return <ErrorCard error={error} onRetry={() => window.location.reload()} />

  return (
    <div className="flex justify-center">
      <div className="flex flex-col bg-white font-sans w-full max-w-5xl">
        <Outlet context={{usuario, setUsuario, onSubmit }} />
      </div>
    </div>
  )
}
