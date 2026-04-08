package ar.edu.unsam.algo3.loaders

import ar.edu.unsam.algo3.ComportamientoCompuesto
import ar.edu.unsam.algo3.Comun
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Fiel
import ar.edu.unsam.algo3.Impaciente
import ar.edu.unsam.algo3.Marketinero
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.Vegano
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import ar.edu.unsam.algo3.service.IngredienteService
import ar.edu.unsam.algo3.service.LocalService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.uqbar.geodds.Point
import java.time.LocalDate
import kotlin.String

@Component
@Order(4)
class UsuarioLoader(
    private val usuarioRepository: UsuarioRepository,
    private val localRepository: LocalRepository,
    private val ingredienteService: IngredienteService,
    private val localService: LocalService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        val ingredientes = ingredienteService.getIngredientes()
        val local1 = localService.localPorId(1)
        val local2 = localService.localPorId(2)

        val direccionJuan = Direccion("Av. Córdoba", 2445, Point(-34.5992, -58.4017))
        val direccionAna = Direccion("Av. Santa Fe", 3200, Point(-34.5880, -58.4090))
        val direccionLuis = Direccion("Av. Corrientes", 1800, Point(-34.6037, -58.3816))

        val clienteJuan = Usuario(
            nombre = "Ariel", apellido = "Arbiser",
            username = "arielitooo@gmail.com",
            direccion = direccionJuan, id = 1,
            imgUrl = "https://www.pagina12.com.ar/fotos/thumb/320/20071017/notas/NA14FO01.jpg"
        ).apply {
            password = "password123"
            fechaNacimiento = LocalDate.of(1990, 5, 15)
            tiempoDeRegistro = LocalDate.of(2000, 5, 15)
        }

        val clienteAna = Usuario(
            nombre = "Fernando", apellido = "Dodain",
            username = "fercitopro77@gmail.com",
            direccion = direccionAna, id = 2,
            imgUrl = "https://avatars.githubusercontent.com/u/4549002?v=4"
        ).apply {
            password = "ana123"
            fechaNacimiento = LocalDate.of(1988, 3, 22)
        }

        val clienteLuis = Usuario(
            nombre = "Luis", apellido = "Mazo",
            username = "luis",
            direccion = direccionLuis, id = 3,
            imgUrl = "https://avatars.githubusercontent.com/u/113392231?v=4"
        ).apply {
            password = "luis123"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
            distanciaMaximaCercania = 5.0
            ingredientesPreferidos = mutableSetOf(ingredientes[0], ingredientes[1], ingredientes[2])
            /* El ingrediente con id=6 es la lechuga, la ensalada de la huerta no debería estar disponible para Luis */
            ingredientesAEvitar = mutableSetOf(ingredientes[3], ingredientes[4], ingredienteService.ingredienteById(6))
            tipoDieta = Comun()
        }

        val clienteGaston = Usuario(
            nombre = "Gaston", apellido = "Aguilera",
            username = "gasti.aguilera",
            direccion = direccionLuis, id = 4,
            imgUrl = "https://cidi.unsam.edu.ar/wp-content/uploads/ultimatemember/87/profile_photo-190x190.jpg?1620779378"
        ).apply {
            password = "luis123"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
        }

        val clienteFabio = Usuario(
            nombre = "Fabio", apellido = "Bruschetti",
            username = "fabito.gamer",
            direccion = direccionLuis, id = 5,
            imgUrl = "https://www.palermo.edu/Archivos_content/diario-interno/280917especialing.jpg"
        ).apply {
            password = "luis123"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
        }

        val clienteMaria = Usuario(
            nombre = "Maria", apellido = "Claudia",
            username = "maria.claudia",
            direccion = direccionLuis, id = 6,
            imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsnyTq2w7KJ7v_G2G2XPIHQvzH8XEWekKBNA&s"
        ).apply {
            password = "luis123"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
        }

        val clienteVeganazo = Usuario(
            nombre = "Vegano", apellido = "Graizzaro",
            username = "vegano.feo",
            direccion = direccionLuis, id = 55,
            imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsnyTq2w7KJ7v_G2G2XPIHQvzH8XEWekKBNA&s"
        ).apply {
            password = "veganofeo"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
            tipoDieta = Vegano()
        }

        val clienteMorfaTodo = Usuario(
            nombre = "Morfón", apellido = "Reemeerie",
            username = "gordo.morfon",
            direccion = direccionLuis, id = 59,
            imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsnyTq2w7KJ7v_G2G2XPIHQvzH8XEWekKBNA&s"
        ).apply {
            password = "gordomorfon"
            fechaNacimiento = LocalDate.of(1995, 11, 2)
            tipoDieta = Comun()
        }

        usuarioRepository.create(clienteJuan)
        usuarioRepository.create(clienteAna)
        usuarioRepository.create(clienteLuis)
        usuarioRepository.create(clienteGaston)
        usuarioRepository.create(clienteFabio)
        usuarioRepository.create(clienteMaria)
        usuarioRepository.create(clienteVeganazo)
        usuarioRepository.create(clienteMorfaTodo)

        val user1 = usuarioRepository.getById(1)
        val user2 = usuarioRepository.getById(2)
        val user3 = usuarioRepository.getById(3)

        val loc1 = localService.localPorId(1)
        val loc2 = localService.localPorId(2)
        val loc3 = localService.localPorId(3)
        val loc4 = localService.localPorId(4)

        user1.localesAPuntuar[loc1] = LocalDate.now()
        user1.localesAPuntuar[loc2] = LocalDate.now().minusDays(1)

        user2.localesAPuntuar[loc3] = LocalDate.now()
        user2.localesAPuntuar[loc4] = LocalDate.now().minusDays(2)

        user3.localesAPuntuar[loc2] = LocalDate.now().minusDays(3)
        user3.localesAPuntuar[loc4] = LocalDate.now()

        usuarioRepository.update(user1)
        usuarioRepository.update(user2)
        usuarioRepository.update(user3)

        println("✅ Datos de los usuarios mockeados en memoria")
    }
}