export type Tab = {
  id: string
  label: string
}

type TabsProps = {
  tabs: Tab[]
  onChange: (id: string) => void
  active: string
}

export const Tabs = ({ tabs, onChange, active }: TabsProps) => {
  return (
    <div className="flex border-b border-gray-100 dark:border-gray-700 transition-colors duration-300 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-3 text-sm text-center font-medium transition-all cursor-pointer border-b-2 -mb-px ${
            active === tab.id
              ? 'text-rose-700 dark:text-rose-400 border-rose-700 dark:border-rose-400'
              : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
