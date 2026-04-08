import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.Resena
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows
import org.uqbar.geodds.Point

class LocalSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest


    describe("Creo un local y testeo features") {
        val resena = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 4.0,
            fecha = "Hace 2 días"
        )
        val resena2 = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 3.0,
            fecha = "Hace 2 días"
        )
        val resena3 = Resena(
            idResena = 1,
            user = "Max Verstappen",
            comentario= "Excelente atención y la comida deliciosa!",
            puntuacion = 4.0,
            fecha = "Hace 2 días"
        )
        /* Instanciación de ar.edu.unsam.algo3.Local */
        val loDeJose =
            Local(1,"Lo de José", Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751)))

        loDeJose.agregarMetodoDePago(MetodosDePago.QR)
        loDeJose.agregarMetodoDePago(MetodosDePago.TRANSFERENCIA)

        /* Tests */
        it("Testeo puntuaciones") {
            // Assert
            loDeJose.puntuacion() shouldBe 0.0

            // Arrange
            loDeJose.agregarResena(resena)
            loDeJose.agregarResena(resena2)
            loDeJose.agregarResena(resena3)

            // Assert
            loDeJose.puntuacion() shouldBe 3.7
        }
    }
})