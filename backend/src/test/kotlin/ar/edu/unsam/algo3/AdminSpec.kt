import ar.edu.unsam.algo3.ActualizacionDeIngredientes
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Admin
import ar.edu.unsam.algo3.AgregarLocales
import ar.edu.unsam.algo3.BorrarCuponesVencidos
import ar.edu.unsam.algo3.BorrarMensajes
import ar.edu.unsam.algo3.ConsumoServicioIngredientes
import ar.edu.unsam.algo3.CuponSinDescuentoAdicional
import ar.edu.unsam.algo3.IngredienteSearchStrategy
import ar.edu.unsam.algo3.LocalSearchStrategy
import ar.edu.unsam.algo3.Mensaje
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.ServiceIngredientesMock
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.UsuarioSearchStrategy
import ar.edu.unsam.algo3.exceptions.BusinessException
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows
import org.uqbar.geodds.Point
import java.time.LocalDate

class AdminSpec: DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Test entrega 3: Creacion clase Admin y procesos") {
        val administrador = Admin
        val mockEmailSender = mockedEmailSender()

        val repositorioIngredientes = Repositorio(IngredienteSearchStrategy())
        val repositorioLocales = Repositorio(LocalSearchStrategy())
        val loDeJose = Local(nombre = "Lo de José", direccion = Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)))
        val loDeDenise = Local(nombre = "Lo de Denise", direccion = Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)))

        it("Testeo procesos borrar mensaje antiguos y leidos") {
            //Todo: agregar mensajes en loDeDenise
            val mensajeAEliminar = Mensaje(LocalDate.of(2025, 1, 1), "Viejo", "", true)
            val mensajeViejoNoLeido = Mensaje(LocalDate.of(2025, 1, 1), "Viejo", "")
            val mensajeNuevoLeido = Mensaje(LocalDate.now(), "Nuevo", "", true)
            loDeDenise.enviarMensaje(mensajeAEliminar)
            loDeDenise.enviarMensaje(mensajeViejoNoLeido)
            loDeDenise.enviarMensaje(mensajeNuevoLeido)

            repositorioLocales.create(loDeDenise)
            val proceso = BorrarMensajes(mockEmailSender, repositorioLocales)
            administrador.agregarPrceso(proceso)
            administrador.ejecutarProcesos()

            repositorioLocales.getById(1).inbox.mensajes shouldBe mutableListOf(mensajeViejoNoLeido, mensajeNuevoLeido)
        }

        it("Testeo Actualizacion de ingredientes") {
            val service = ConsumoServicioIngredientes(ServiceIngredientesMock, repositorioIngredientes)
            val proceso = ActualizacionDeIngredientes(mockEmailSender, service)
            administrador.agregarPrceso(proceso)
            administrador.ejecutarProcesos()

            repositorioIngredientes.getAll().size shouldBe 5
        }

        it("Testeo borrar cupones vencidos sin aplicar") {
            val cuponVencido = CuponSinDescuentoAdicional(2, 0.3)
            cuponVencido.fechaEmision = LocalDate.now().minusDays(5)
            val cupon = CuponSinDescuentoAdicional(2, 0.3)
            val usuario = Usuario( nombre = "dante",apellido = "tripodi", username = "Rubia",  direccion = Direccion("calle falsa", 123, Point(-34.599220725558055, -58.40170853602751)), imgUrl = ""
            ).apply {
                password = "1234"
                fechaNacimiento = LocalDate.of(2003, 12, 2)
                tiempoDeRegistro = LocalDate.of(2024, 3, 29)
                agregarCupon(cuponVencido)
                agregarCupon(cupon)
            }
            val repoUsuario = Repositorio(UsuarioSearchStrategy()).apply { create(usuario) }
            val proceso = BorrarCuponesVencidos(mockEmailSender, repoUsuario)
            administrador.agregarPrceso(proceso)
            administrador.ejecutarProcesos()

            assertThrows<BusinessException> {
                usuario.existeCupon(cuponVencido)
            }
            usuario.existeCupon(cupon) shouldBe cupon
        }

        it("Testeo agregar locales") {
            val proceso = AgregarLocales(mockEmailSender, repositorioLocales, listOf(loDeJose, loDeDenise))
            administrador.agregarPrceso(proceso)
            administrador.ejecutarProcesos()

            repositorioLocales.getAll().size shouldBe 2
        }

        it("Testeo de varios procesos a la vez") {
            val procesoLocales = AgregarLocales(mockEmailSender, repositorioLocales, listOf(loDeJose, loDeDenise))
            val service = ConsumoServicioIngredientes(ServiceIngredientesMock, repositorioIngredientes)
            val procesoIngredientes = ActualizacionDeIngredientes(mockEmailSender, service)

            administrador.agregarPrceso(procesoLocales)
            administrador.agregarPrceso(procesoIngredientes)

            administrador.ejecutarProcesos()
            repositorioIngredientes.getAll().size shouldBe 5
            repositorioLocales.getAll().size shouldBe 2

            administrador.limpiarLista()
            administrador.procesos.size shouldBe 0
        }
    }
})
