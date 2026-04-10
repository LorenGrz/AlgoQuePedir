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
    <div className="px-4 py-3 flex flex-col gap-2 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="relative">
        <input
          data-testid="search-input"
          type="text"
          value={texto}
          onChange={(e) => handleTextoChange(e.target.value)}
          placeholder="Buscá tu local para pedir..."
          className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600/20 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <img
          src={lupa}
          alt="Buscar"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 dark:opacity-50 dark:invert pointer-events-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
        <input
          data-testid="search-checkbox"
          type="checkbox"
          checked={soloCercanos}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 accent-rose-600 focus:ring-2 focus:ring-rose-300 cursor-pointer"
        />
        Buscar locales cercanos
      </label>
    </div>
  )
}
