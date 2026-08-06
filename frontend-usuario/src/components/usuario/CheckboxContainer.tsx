import React from 'react'

type Props = {
  titulo: string
  descripcion: string
  nombre: string
  checked: boolean
  onCheckedChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
}

export const CheckboxContainer = ({ titulo, descripcion, nombre, checked, onCheckedChange, children }: Props) => {
  
  return (
    <div className="py-2 w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-xl p-5 my-2 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">{titulo}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{descripcion}</p>
        </div>
        <input
          type="checkbox"
          checked={checked}
          name={nombre}
          onChange={(e) => onCheckedChange(e)}
          className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 accent-rose-600 focus:ring-2 focus:ring-rose-300 cursor-pointer"
        />
      </div>

      <div className="">{children}</div>
    </div>
  )
}
