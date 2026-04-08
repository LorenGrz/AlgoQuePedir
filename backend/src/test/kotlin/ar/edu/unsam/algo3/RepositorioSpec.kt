import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.IngredienteSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.exceptions.NotFoundException
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.assertThrows

class RepositorioSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Creo un repositorio de Ingredientes y testeo features") {
        // Instanciaciones
        val egg = Ingrediente("Huevo", 50.5, GrupoAlimenticio.PROTEINAS, true)
        val cheese = Ingrediente("Queso", 200.0, GrupoAlimenticio.LACTEOS, true)
        val perejil = Ingrediente("Perejil", 15.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)
        val repositorioIngrediente = Repositorio(IngredienteSearchStrategy())

        repositorioIngrediente.create(egg)
        repositorioIngrediente.create(cheese)
        repositorioIngrediente.create(perejil)

        // Tests
        it("Testeo search"){
            // Arrange
            val resultados = repositorioIngrediente.search("Huevo")

            // Assert
            resultados.size shouldBe 1
            resultados shouldContain egg
        }
        it("Testeo delete + getAll"){
            // Se puede testear de otra forma? Queda feo
            var ingredientes = repositorioIngrediente.getAll()
            ingredientes.size shouldBe 3
            repositorioIngrediente.delete(egg)
            ingredientes = repositorioIngrediente.getAll()
            ingredientes.size shouldBe 2
        }
        it("No puedo eliminar un objeto que no existe en el set"){
            // Arrange
            val ricota = Ingrediente("Ricota", 300.0, GrupoAlimenticio.LACTEOS, true)
            ricota.id = 90

            // Assert
            assertThrows<NotFoundException> { repositorioIngrediente.delete(ricota) }
        }
        it("Testeo getById"){
            // Arrange
            val ingrediente = repositorioIngrediente.getById(2)

            // Assert
            ingrediente shouldBe cheese // Porque lo agregué segundo
        }
        it("No puedo buscar un objeto que no existe en el map"){
            // Assert
            assertThrows<NotFoundException> { repositorioIngrediente.getById(15) }
        }
        it("Testeo update"){
            // Arrange
            val ricota = Ingrediente("Ricota", 300.0, GrupoAlimenticio.LACTEOS, true)
            ricota.id = 2 // No me gusta, y si se lo paso por parametro a update() y que labure la funcion?
            repositorioIngrediente.update(ricota) // update(2, ricota)
            val ing = repositorioIngrediente.getById(2)

            //Assert
            ing shouldBe ricota
        }
        it("No puedo actualizar un objeto que no tiene id"){
            // Arrange
            val ricota = Ingrediente("Ricota", 300.0, GrupoAlimenticio.LACTEOS, true)

            // Assert
            assertThrows<IllegalArgumentException> { repositorioIngrediente.update(ricota)  }
        }
        it("No puedo actualizar un objeto que no existe en el map"){
            // Arrange
            val ricota = Ingrediente("Ricota", 300.0, GrupoAlimenticio.LACTEOS, true)
            ricota.id = 15

            // Assert
            assertThrows<NotFoundException> { repositorioIngrediente.update(ricota)  }
        }
    }
})