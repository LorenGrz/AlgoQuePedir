import cart from 'src/assets/icons/cart.svg'

type HeaderProps = {
  label: string
}

export const HeaderHome = ({ label }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      <button className="p-2 rounded-full hover:bg-gray-100">
        <img src={cart} alt="Carrito" className="w-5 h-5" />
      </button>
    </header>
  )
}
