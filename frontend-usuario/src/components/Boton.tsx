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
    primario: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
    secundario: 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
    gris: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600',
    pildora: 'bg-rose-600 text-white hover:bg-rose-700 rounded-b-full rounded-t-full',
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
