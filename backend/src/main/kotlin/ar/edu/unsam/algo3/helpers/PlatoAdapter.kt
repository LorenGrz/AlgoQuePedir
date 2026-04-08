package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.dto.PlatoDTO
import config.EnvironmentVariables
import org.springframework.stereotype.Service

interface PlatoAdapter {
    fun toDto(plato: Plato): PlatoDTO
    fun fromDTO(platoDTO: PlatoDTO, id: Int? = null, local: Local): Plato
}

@Service
class PlatoMapper(val ingredienteMapper: IngredienteMapper): PlatoAdapter {
    override fun toDto(plato: Plato): PlatoDTO = PlatoDTO(
        id = plato.id!!, // el repo siempre devuelve platos con ID
        nombre = plato.nombre,
        descripcion = plato.descripcion,
        precioBase = plato.valorBase,
        imgUrl = plato.img,
        autor = plato.platoDeAutor,
        porcentajeDescuento = plato.porcentajeDescuento,
        ingredientes = plato.listaIngredientes.map { ing -> ingredienteMapper.toDto(ing) },
        nuevo = plato.esPlatoNuevo(),
        lanzamiento = plato.lanzamiento
    )

    override fun fromDTO(platoDTO: PlatoDTO, id: Int?, local: Local): Plato {
        val plato = Plato(
            nombre = platoDTO.nombre,
            local = local,
            listaIngredientes = platoDTO.ingredientes.map { ing -> ingredienteMapper.fromDto(ing) }.toMutableList()
        )
        if (id != null) {
            plato.id = id
        }
        plato.descripcion = platoDTO.descripcion
        plato.valorBase = platoDTO.precioBase
        plato.platoDeAutor = platoDTO.autor
        plato.img = platoDTO.imgUrl
        if (platoDTO.porcentajeDescuento != null){
            plato.porcentajeDescuento = platoDTO.porcentajeDescuento
        }
        if (platoDTO.lanzamiento != null){
            plato.lanzamiento = platoDTO.lanzamiento
        }
        return plato
    }
}
