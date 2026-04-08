import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class AlgoQuePedirSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Tests Creo Ingrediente") {
        it("Creo un ingrediente lacteo, con valor 150 y de origen animal") {
            // Arrange
            val leche = Ingrediente("Leche", 150.6, GrupoAlimenticio.LACTEOS, true)
            // Assert
            leche.nombre shouldBe "Leche"
            leche.costoMercado shouldBe 150.6
            leche.grupo shouldBe GrupoAlimenticio.LACTEOS
            leche.origenAnimal shouldBe true
        }
    }
})