import type { Plato } from '../../models/platoModel'

export const PlatoMenu = ({ id, nombre, descripcion, precio, img, popular }: Plato) => {
  return (
    <article className="flex items-center justify-between gap-5">
      <div className="flex flex-col justify-baseline gap-0.5">
        <p className="text-xs text-red-500 uppercase">{popular && <>Popular</>}</p>
        <h4 className="font-semibold text-gray-900" data-testid={`plato-${id}`}>
          {nombre}
        </h4>
        <p className="text-sm text-gray-500">{descripcion}</p>

        <span className="mt-2 inline-block bg-gray-100 text-gray-800 text-sm font-medium px-6 py-2 rounded-lg w-fit">
          ${precio}
        </span>
      </div>
      <img src={img} alt="Fettuccine Alfredo" className="object-cover w-26 h-28 rounded-lg" />
    </article>
  )
}
