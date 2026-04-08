package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.dto.PlatoMenuDTO
import org.springframework.stereotype.Service

interface MenuAdapter {
    fun toDto(platos: List<Plato>): List<PlatoMenuDTO>

}

@Service
class MenuMapper: MenuAdapter {
    override fun toDto(platos: List<Plato>): List<PlatoMenuDTO> {
        return platos.map { plato ->
            PlatoMenuDTO(
                nombre = plato.nombre,
                descripcion = plato.descripcion,
                precio = plato.obtenerPrecio(),
                img = plato.img,
                id = plato.id!!,
                popular = plato.popular
            )
        }
    }
}