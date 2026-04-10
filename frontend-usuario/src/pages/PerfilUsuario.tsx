import React from 'react'
import arrowIcon from '../assets/icons/simple-arrow-right.svg'
import noImage from '../assets/images/no-Image.png'
import { Boton } from '../components/Boton'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { INPUT_CLASES_STYLE } from '../classes/usuario/Constants'
import { UsuarioOutletContext } from '../layouts/UsuarioLayout'
import { Usuario } from '../classes/usuario/Usuario'

export const PerfilUsuario = () => {
  const navigate = useNavigate()
  const { usuario, onSubmit, setUsuario } = useOutletContext<UsuarioOutletContext>()

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    // mapeo básico de tipos (número/text)
    const parsed =
      type === 'number' ? (value === '' ? 0 : Number(value)) :
      value
    const atributo = name as keyof Usuario
    const newState = Object.assign(new Usuario(), {...usuario, [atributo]: parsed as any})
    setUsuario(newState)
  }

  return (
    <>
      {/* // -------- Info Usuario -------- */}
      <section className="flex flex-col items-center">
        <h1 className="text-gray-900 dark:text-gray-100">Perfil</h1>
        <img src={usuario.imgUrl ?? noImage} alt="" className="rounded-full w-3xs my-5" />
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {usuario.nombre} {usuario.apellido}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
      </section>

      {/* // -------- Infor personal -------- */}
      <section className="flex flex-col mx-3 my-5 ">
        <h2 className="py-3 font-semibold text-gray-900 dark:text-gray-100">Informacion Personal</h2>

        <label className="flex flex-col my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre
          <input
            name="nombre"
            type="text"
            value={usuario.nombre}
            className={INPUT_CLASES_STYLE}
            onChange={inputChange}
          />
        {usuario.errors?.nombre && <p className="text-red-500 text-sm">{usuario.errors.nombre}</p>}
        </label>

        <label className="flex flex-col my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Apellido
          <input
            name="apellido"
            type="text"
            value={usuario.apellido}
            className={INPUT_CLASES_STYLE}
            onChange={inputChange}
          />
        {usuario.errors?.apellido && <p className="text-red-500 text-sm">{usuario.errors.apellido}</p>}
        </label>
        <label className="flex flex-col my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Direccion
          <input
            name="direccion"
            type="text"
            value={usuario.direccion}
            className={INPUT_CLASES_STYLE}
            onChange={inputChange}
          />
        {usuario.errors?.direccion && <p className="text-red-500 text-sm">{usuario.errors.direccion}</p>}
        </label>
        <label className="flex flex-col my-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Altura
          <input
            name="altura"
            type="number"
            value={usuario.altura}
            className={INPUT_CLASES_STYLE}
            onChange={inputChange}
          />
        {usuario.errors?.altura && <p className="text-red-500 text-sm">{usuario.errors.altura}</p>}
        </label>
        <div className="flex my-2">
          <label className="flex-1 flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
            Latitud
            <input
              name="latitud"
              type="number"
              value={usuario.latitud}
              className={INPUT_CLASES_STYLE}
              onChange={inputChange}
            />
          </label>
          <label className="flex-1 ml-5 flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
            Longitud
            <input
              name="longitud"
              type="number"
              value={usuario.longitud}
              className={INPUT_CLASES_STYLE}
              onChange={inputChange}
            />
          </label>
        </div>
      </section>

      {/* // -------- Preferencias -------- */}
      <section className="mx-3 font-semibold">
        <h2 className="py-3 text-gray-900 dark:text-gray-100">Preferencias</h2>

        <button
          className="flex justify-between py-2 w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors rounded-lg px-1"
          onClick={() => { navigate('/usuario/criterios') }}
        >
          <div>Criterios de busqueda</div>
          <img src={arrowIcon} alt=">" className="dark:invert" />
        </button>
        <button
          className="flex justify-between py-2 w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors rounded-lg px-1"
          onClick={() => { navigate('/usuario/preferidos') }}
        >
          <div>Ingredintes preferidos</div>
          <img src={arrowIcon} alt=">" className="dark:invert" />
        </button>
        <button
          className="flex justify-between py-2 w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors rounded-lg px-1"
          onClick={() => { navigate('/usuario/evitar') }}
        >
          <div>Ingredientes a evitar</div>
          <img src={arrowIcon} alt=">" className="dark:invert" />
        </button>
      </section>

      <div className="mx-3 my-5">
        <Boton
          tipo="primario"
          onClick={() => {
            onSubmit()
          }}
        >
          Guardar
        </Boton>
      </div>
    </>
  )
}
