package ar.edu.unsam.algo3.helpers

import ar.edu.unsam.algo3.ComportamientoCompuesto
import ar.edu.unsam.algo3.ComportamientoUsuario
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Fiel
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.dto.UsuarioDTO
import ar.edu.unsam.algo3.dto.LoginUsuarioDTO
import ar.edu.unsam.algo3.dto.RetornoUsuarioDTO
import ar.edu.unsam.algo3.repository.LocalRepository
import org.springframework.stereotype.Service
import org.uqbar.geodds.Point
import java.time.LocalDate

interface UsuarioAdapter {
    fun toDto(usuario: Usuario): UsuarioDTO
    fun fromDto(usuarioDto: UsuarioDTO, id: Int): Usuario
    fun toRetornoDTO(usuario: Usuario): RetornoUsuarioDTO
    fun newUsuarioFromRegister(registerDTO: LoginUsuarioDTO): Usuario
}

@Service
class UsuarioMapper(private val localRepository: LocalRepository, private val ingredienteAdapter: IngredienteAdapter ): UsuarioAdapter  {
    override fun fromDto(usuarioDto: UsuarioDTO, id: Int): Usuario {
        val usuario = Usuario(
            nombre = usuarioDto.nombre,
            apellido = usuarioDto.apellido,
            username = usuarioDto.email,
            direccion = Direccion(
                calle = usuarioDto.direccion,
                altura = usuarioDto.altura,
                ubicacion = Point(
                    usuarioDto.latitud,
                    usuarioDto.longitud
                )
            ),
            id,
            imgUrl = usuarioDto.imgUrl
        )

        usuario.distanciaMaximaCercania = usuarioDto.distancia

        val tipoDietaReconstruido = reconstruirTipoDieta(usuarioDto.tipoDieta)
        usuario.tipoDieta = tipoDietaReconstruido

        usuarioDto.ingredientesAEvitar.forEach {
            usuario.agregarIngredienteAEvitar(ingredienteAdapter.fromDto(it))
        }
        usuarioDto.ingredientesPreferidos.forEach {
            usuario.agregarIngredientePreferido(ingredienteAdapter.fromDto(it))
        }
        return usuario
    }

    override fun toDto(usuario: Usuario): UsuarioDTO = UsuarioDTO(
        nombre = usuario.nombre,
        apellido = usuario.apellido,
        direccion = usuario.direccion.calle,
        altura = usuario.direccion.altura,
        latitud = usuario.direccion.ubicacion.x,
        longitud = usuario.direccion.ubicacion.y,
        imgUrl = usuario.imgUrl,
        email = usuario.username,

        ingredientesAEvitar = usuario.ingredientesAEvitar.map{ ing: Ingrediente -> ingredienteAdapter.toDto(ing) },
        ingredientesPreferidos = usuario.ingredientesPreferidos.map{ ing: Ingrediente -> ingredienteAdapter.toDto(ing) },

        distancia = usuario.distanciaMaximaCercania,
        tipoDieta = usuario.tipoDieta
    )

    override fun toRetornoDTO(usuario: Usuario): RetornoUsuarioDTO = RetornoUsuarioDTO(
        id = usuario.id ?: -1,
        username = usuario.username
    )

    override fun newUsuarioFromRegister(registerDTO: LoginUsuarioDTO): Usuario {
        // Crea dirección por defecto (ubicación 0,0)
        val direccionPorDefecto = Direccion(
            calle = "",
            altura = 0,
            ubicacion = Point(0.0, 0.0)
        )

        val usuario =  Usuario(
            id = null,
            nombre = "",
            apellido = "",
            username = registerDTO.username,
            direccion = direccionPorDefecto,
            imgUrl = ""
        ).apply {
            password = registerDTO.password
            fechaNacimiento = LocalDate.now().minusYears(18)
            tiempoDeRegistro =
                LocalDate.now()
        }
        return usuario
    }

    private fun reconstruirTipoDieta(tipo: ComportamientoUsuario): ComportamientoUsuario {
        return when (tipo) {
            is Fiel -> reconstruirFiel(tipo)
            is ComportamientoCompuesto -> reconstruirComportamientoCompuesto(tipo)
            else -> tipo   // Comun, Vegano, Exquisito, etc. no necesitan nada especial
        }
    }

    private fun reconstruirFiel(fielJson: Fiel): Fiel {
        // fielJson.localesPreferidos viene con Local “parche” deserializados del JSON
        val localesDesdeRepo: MutableSet<Local> = fielJson.localesPreferidos
            .mapNotNull { localJson ->
                val id = localJson.id
                if (id == null) {
                    null
                } else {
                    localRepository.getById(id)  // Acá te traés el Local real desde la DB
                }
            }
            .toMutableSet()

        return Fiel().apply {
            this.localesPreferidos = localesDesdeRepo
        }
    }

    private fun reconstruirComportamientoCompuesto(ccJson: ComportamientoCompuesto): ComportamientoCompuesto {
        val comportamientosReconstruidos = ccJson.comportamientos
            .map { reconstruirTipoDieta(it) }
            .toMutableList()

        return ComportamientoCompuesto().apply {
            comportamientos = comportamientosReconstruidos
        }
    }
}
