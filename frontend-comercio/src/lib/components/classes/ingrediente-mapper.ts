import { INGREDIENTE_GRUPO_CEREALES_TUBERCULOS, INGREDIENTE_GRUPO_DULCE, INGREDIENTE_GRUPO_FRUTA_VERDURA, INGREDIENTE_GRUPO_GRASA, INGREDIENTE_GRUPO_LACTEO, INGREDIENTE_GRUPO_PROTE } from './Ingrediente-constantes'

export function getGrupoAlimenticioLabel(grupoAlimenticio: string): string {
  switch (grupoAlimenticio) {
  case INGREDIENTE_GRUPO_PROTE:
    return 'Proteina'
  case INGREDIENTE_GRUPO_LACTEO:
    return 'Lacteos'
  case INGREDIENTE_GRUPO_FRUTA_VERDURA:
    return 'Frutas y Verduras'
  case INGREDIENTE_GRUPO_CEREALES_TUBERCULOS:
    return 'Cereales y Tuberculos'
  case INGREDIENTE_GRUPO_DULCE:
    return 'Azucares y dulce'
  case INGREDIENTE_GRUPO_GRASA:
    return 'Grasas y Aceite'
  default:
    return ''
  }
}
