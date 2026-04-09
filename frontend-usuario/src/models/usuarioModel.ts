import { ComportamientoCompuesto, Comun, Conservador, Exquisito, Fiel, Impaciente, Marketinero, Vegano } from '../classes/usuario/UsuarioComportamiento';

export const TipoDietaEnum = {
  COMUN: 'Comun',
  VEGANO: 'Vegano',
  EXQUISITO: 'Exquisito',
  CONSERVADOR: 'Conservador',
  FIEL: 'Fiel',
  IMPACIENTE: 'Impaciente',
  MARKETINERO: 'Marketinero',
  COMPUESTO: 'ComportamientoCompuesto'
} as const
export type TipoDietaEnumType = (typeof TipoDietaEnum)[keyof typeof TipoDietaEnum]

export type TipoDieta = Comun | Vegano | Exquisito | Conservador | Fiel | Impaciente |  Marketinero | ComportamientoCompuesto

export interface TipoDietaJson {
  type?: string;
  comportamientos?: TipoDietaJson[];
  [key: string]: any
}
