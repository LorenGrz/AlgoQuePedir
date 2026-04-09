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
    <div className="py-2 w-full border-2 border-gray-300 rounded-lg p-5 my-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-gray-900">{titulo}</div>
          <p className="text-gray-500">{descripcion}</p>
        </div>
        <input
          type="checkbox"
          checked={checked}
          name={nombre}
          onChange={(e) => onCheckedChange(e)}
          className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-red-300"
        />
      </div>

      <div className="">{children}</div>
    </div>
  )
}
