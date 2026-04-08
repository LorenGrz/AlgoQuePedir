import ar.edu.unsam.algo3.AccionEstablecerPedido
import ar.edu.unsam.algo3.AccionPuntuarLocales
import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.PuntuacionActual
import ar.edu.unsam.algo3.PuntuacionAleatoria
import ar.edu.unsam.algo3.PuntuacionFija
import ar.edu.unsam.algo3.Resena
import ar.edu.unsam.algo3.Usuario
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.uqbar.geodds.Point
import java.time.LocalDate
import io.kotest.matchers.doubles.shouldBeGreaterThanOrEqual
import io.kotest.matchers.doubles.shouldBeLessThanOrEqual
import io.mockk.every
import io.mockk.mockk

class AccionesUsuarioSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Tests de Acciones de Usuario") {

        val usuario = Usuario(
            "Juan", "Perez", "juanp",
            Direccion("Calle", 123, Point(0.0, 0.0)),
            imgUrl = ""
        ).apply {
            password = "123"
            fechaNacimiento = LocalDate.of(1990, 1, 1)
            tiempoDeRegistro = LocalDate.of(2023, 1, 1)
        }

        val local = Local(nombre= "Pizzería", direccion = Direccion("Av", 456, Point(0.0, 0.0)))
        val pedido = _root_ide_package_.ar.edu.unsam.algo3.Pedido(usuario, local)

        it("Agregar y ejecutar acción de establecer pedido") {
            val accion = AccionEstablecerPedido(usuario, pedido)

            usuario.accionesPendientes.agregarAccion(accion)
            usuario.accionesPendientes.cantidadAcciones() shouldBe 1

            usuario.accionesPendientes.ejecutarTodas()
            usuario.accionesPendientes.cantidadAcciones() shouldBe 0
        }

        it("Agregar acción de puntuar con puntuación fija") {
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 5.0,
                fecha = "Hace 2 días"
            )
            local.agregarResena(resena) // Para que tenga puntuación

            usuario.confirmarPedido(pedido) // Para que pueda puntuar

            val estrategia = PuntuacionFija(resena)
            val accion = AccionPuntuarLocales(usuario, estrategia)

            usuario.accionesPendientes.agregarAccion(accion)
            usuario.accionesPendientes.ejecutarTodas()

            // Verifica que se ejecutó
            usuario.accionesPendientes.cantidadAcciones() shouldBe 0
        }

        //PUNTUACION FIJA
        it("PuntuacionFija devuelve el mismo valor y nombre correcto") {
            val resena = Resena(
                idResena = 1,
                user = "Max Verstappen",
                comentario= "Excelente atención y la comida deliciosa!",
                puntuacion = 2.5,
                fecha = "Hace 2 días"
            )
            val fijo = PuntuacionFija(resena)
            val resenaResultante = fijo.calcularPuntuacion(local)

            resenaResultante.puntuacion shouldBe 2.5
        }

        //PRUEBAS PARA CASOS NEGATIVOS Y FUERAS DE RANGO
//        it("Constructor de PuntuacionFija con valor < 1 lanza Exception") {
//           shouldThrow<BusinessException>{
//                PuntuacionFija(0.9)
//            }
//        }
//        it("Constructor de PuntuacionFija con valor > 5 lanza Exception") {
//            shouldThrow<BusinessException> {
//                PuntuacionFija(5.1)
//            }
//        }

        //PUNTUACION ALEATORIA
        it("Mock de ar.edu.unsam.algo3.Local relajado para PuntuacionAleatoria") {
            val localDePruebaParaAleatoria = mockk<Local>(relaxed = true)
            every { localDePruebaParaAleatoria.nombre } returns "ar.edu.unsam.algo3.Local de Prueba"

             //Ejemplo de uso en test:
             // Con PuntuacionAleatoria no importa el valor de local.puntuacion()
             val estrategia = PuntuacionAleatoria()
             val resena = estrategia.calcularPuntuacion(localDePruebaParaAleatoria)
             resena.puntuacion shouldBeGreaterThanOrEqual 1.0
             resena.puntuacion shouldBeLessThanOrEqual 5.0
        }


        //PUNTUACION ACTUAL
        it("devuelve la puntuación del local cuando esta es mayor a 0") {
            // Mockeamos un ar.edu.unsam.algo3.Local cuyo método puntuacion() regresa 4.2 (> 0)
            val localMock = mockk<Local>()
            every { localMock.puntuacion() } returns 4.2

            val estrategia = PuntuacionActual()
            val resultado = estrategia.calcularPuntuacion(localMock)

            resultado.puntuacion.shouldBe(4.2)
        }

        it("devuelve 3.0 cuando la puntuación del local es igual a 0") {
            // Mockeamos un ar.edu.unsam.algo3.Local cuyo método puntuacion() regresa 0.0
            val localMock = mockk<Local>()
            every { localMock.puntuacion() } returns 0.0

            val estrategia = PuntuacionActual()
            val resultado = estrategia.calcularPuntuacion(localMock)

            resultado.puntuacion.shouldBe(3.0)
        }
    }
})

