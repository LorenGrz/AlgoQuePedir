import { CheckboxContainer } from './CheckboxContainer'
import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { UsuarioOutletContext } from '../../layouts/UsuarioLayout'
import { Header } from '../Header'
import volverIcon from '../../assets/icons/arrow-left.svg'
import { Boton } from '../Boton'
import { useOnInit } from '../../utils/hooks'
import { ComportamientoErrors, ComportamientoUsuario, Conservador, Exquisito, Fiel, Impaciente, Marketinero, Vegano } from '../../classes/usuario/UsuarioComportamiento'
import { CriterioLocales } from './CriterioLocales'
import { CriterioMarketinero } from './CriterioMarketinero'
import { mapTipoDietaFromJson, mapTipoDietaToJson } from '../../utils/Usuario/UsuarioMapper'
import { TipoDietaEnum } from '../../models/usuarioModel'
import { Usuario } from '../../classes/usuario/Usuario'
import { toast } from 'react-toastify'

export const CriteriosPanel = () => {
  const contadorBtn = `inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 
        text-gray-700 shadow-inner hover:bg-gray-200 active:bg-gray-300 
        focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-40 disabled:cursor-not-allowed`

  const { usuario, setUsuario } = useOutletContext<UsuarioOutletContext>()

  const [criterios, setCriterios] = useState<ComportamientoUsuario<any>[]>([])
  const [distancia, setDistancia] = useState<number>(usuario.distancia)
  const [errors, setErrors] = useState<ComportamientoErrors>({})
  const navigate = useNavigate()

  // -------- OnInit --------
  const init = async () => {
    setCriterios(mapTipoDietaFromJson(usuario.tipoDieta))
  }
  useOnInit(init)

  // -------- Handler --------
  const seleccionarCriterio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    if (checked) {
      setCriterios(criterios.concat(mapTipoDietaFromJson({type: name})))
    } else {
      setCriterios(criterios.filter(c => c.constructor.name !== name))
    }
  }

  const onSubmit = () => {
    let nuevosErrors: ComportamientoErrors = {}
    criterios.forEach((c) => {
      if (c.validar) {
        const err = c.validar(usuario)
        nuevosErrors = { ...nuevosErrors, ...err }
      }
    })
    setErrors(nuevosErrors)
    if (Object.keys(nuevosErrors).length === 0) {
      setUsuario(prev => new Usuario({
        ...prev,
        tipoDieta: mapTipoDietaToJson(criterios),
        distancia
      }))
      toast.success('Criterios guardados, no olvides de guardar el usuario!')
      navigate('/usuario/perfil') 
    }
  }

  // -------- HTML --------
  return (
    <div className='h-[calc(100dvh-5rem)] flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300'>
      <Header label="Selecciona tu criterio" icon={volverIcon}></Header>
      <div className='flex-1 overflow-hidden'> 
        <section className="h-full overflow-y-auto px-6 py-4">
          <CheckboxContainer
            titulo="Veganos"
            descripcion="Solo los platos veganos"
            nombre={TipoDietaEnum.VEGANO}
            checked={criterios.some(c => c instanceof Vegano)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          >
            {errors[TipoDietaEnum.VEGANO] && <p className="text-red-500 text-sm">{errors[TipoDietaEnum.VEGANO]}</p>}
          </CheckboxContainer>
          <CheckboxContainer
            titulo="Exquisitos"
            descripcion="Solo platos de autor"
            nombre={TipoDietaEnum.EXQUISITO}
            checked={criterios.some(c => c instanceof Exquisito)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          ></CheckboxContainer>
          <CheckboxContainer
            titulo="Conservadores"
            descripcion="Solo platos con ingredientes preferidos"
            nombre={TipoDietaEnum.CONSERVADOR}
            checked={criterios.some(c => c instanceof Conservador)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          ></CheckboxContainer>

          {/* // -------- Locales -------- */}
          <CheckboxContainer
            titulo="Fieles"
            descripcion="Solo los restaurantes preferidos"
            nombre={TipoDietaEnum.FIEL}
            checked={criterios.some(c => c instanceof Fiel)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          >
            {errors[TipoDietaEnum.FIEL] && <p className="text-red-500 text-sm">{errors[TipoDietaEnum.FIEL]}</p>}

            {criterios.some(c => c instanceof Fiel) && <CriterioLocales criterio={criterios.find((c) => c instanceof Fiel)!}></CriterioLocales>}
          </CheckboxContainer>


          {/* // -------- Palabras -------- */}
          <CheckboxContainer
            titulo="Marketing"
            descripcion="Filtran platos por palabras buscadas"
            nombre={TipoDietaEnum.MARKETINERO}
            checked={criterios.some(c => c instanceof Marketinero)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          >
            {criterios.some(c => c instanceof Marketinero) && <CriterioMarketinero criterio={criterios.find((c) => c instanceof Marketinero)!} errors={errors} setErrors={setErrors} ></CriterioMarketinero>}
            {errors[TipoDietaEnum.MARKETINERO] && <p className="text-red-500 text-sm">{errors[TipoDietaEnum.MARKETINERO]}</p>}
          </CheckboxContainer>

          {/* // -------- Distancia -------- */}
          <CheckboxContainer
            titulo="Impacientes"
            descripcion="Dentro de una distancia maxima"
            nombre={TipoDietaEnum.IMPACIENTE}
            checked={criterios.some(c => c instanceof Impaciente)}
            onCheckedChange={(e) => seleccionarCriterio(e)}
          >
            {criterios.some(c => c instanceof Impaciente) && 
            
              <div className="cursor-pointer flex w-full justify-between py-2 text-gray-500 my-2">
                <span>Distancia (kms)</span>
                <div>
                  <span className={contadorBtn} onClick={() => { setDistancia(prev => Math.max(1, prev - 1))}}>
                    -
                  </span>
                  <span className="m-2 font-semibold text-gray-900">{distancia}</span>
                  <span className={contadorBtn} onClick={() => { setDistancia(prev => prev + 1 )}}>
                    +
                  </span>
                </div>
              </div>
            }

          </CheckboxContainer>
        </section>
      </div>

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
    </div>
  )
}
