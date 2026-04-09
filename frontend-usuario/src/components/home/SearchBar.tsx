import lupa from 'src/assets/icons/lupa.svg'
import { useState } from 'react'
import { useRef } from 'react'

type Props = {
  onSearch: (texto: string, soloCercanos: boolean) => Promise<void>
}

export const SearchBar = ({ onSearch }: Props) => {
  const [texto, setTexto] = useState('')
  const [soloCercanos, setSoloCercanos] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTextoChange = (value: string) => {
    setTexto(value)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onSearch(value, soloCercanos)
    }, 250)
  }
  const handleCheckboxChange = (checked: boolean) => {
    setSoloCercanos(checked)
    onSearch(texto, checked)
  }

  return (
    <div className="px-4 py-3 flex flex-col gap-2 bg-white">
      <div className="relative">
        <input
          data-testid="search-input"
          type="text"
          value={texto}
          onChange={(e) => handleTextoChange(e.target.value)}
          placeholder="Buscá tu local para pedir..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <img
          src={lupa}
          alt="Buscar"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-60"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          data-testid="search-checkbox"
          type="checkbox"
          checked={soloCercanos}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-red-300"
        />
        Buscar locales cercanos
      </label>
    </div>
  )
}
