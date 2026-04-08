import React from 'react'

type Props = {
  tipo: 'primario' | 'secundario' | 'gris' | 'pildora' | 'imagen' | 'custom'
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  className?: string
}

export const Boton = ({ tipo = 'primario', children, onClick, disabled, className }: Props) => {
  const defaultBase = 'w-full py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer'
  const base = className || defaultBase

  const variantes = {
    primario: 'bg-red-600 text-white hover:bg-red-700',
    secundario: 'bg-white border text-gray-700 hover:bg-gray-100',
    gris: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    pildora: 'bg-red-600 text-white hover:bg-red-700 rounded-b-full rounded-t-full',
    imagen: 'p-1',
    custom: ''
  }

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return (
    <button
      // Combinamos: Tu base elegida + la variante de color + estado disabled
      className={`${base} ${variantes[tipo]} ${disabledClass}`}
      onClick={onClick}
      disabled={disabled} // Importante: pasar el atributo al DOM
      data-testid="verPedidoBoton"
      type="button"
    >
      {children}
    </button>
  )
}
