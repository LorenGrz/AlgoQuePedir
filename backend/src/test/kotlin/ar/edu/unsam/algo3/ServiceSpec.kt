import ar.edu.unsam.algo3.ConsumoServicioIngredientes
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.IngredienteSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.ServiceIngredientesMock
import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class ServiceSpec : DescribeSpec({
    isolationMode = IsolationMode.InstancePerTest

    describe("Creo un repositorio de Ingredientes y testeo el service") {
        // Instanciaciones
        // Se crea un repo inicial con 3 ingredientes

        // id = 1
        val egg = Ingrediente("Huevo", 50.5, GrupoAlimenticio.PROTEINAS, true)
        // id = 2
        val cheese = Ingrediente("Queso", 200.0, GrupoAlimenticio.LACTEOS, true)
        // id = 3
        val perejil = Ingrediente("Perejil", 15.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false)

        val repositorioIngredientes = Repositorio(IngredienteSearchStrategy())
        repositorioIngredientes.create(egg)
        repositorioIngredientes.create(cheese)
        repositorioIngredientes.create(perejil)

        // Tests
        it("Tamaño inicial del repositorio deberia ser de 3 objetos"){
            // Arrange
            val ingredientes = repositorioIngredientes.getAll()

            // Assert
            ingredientes.size shouldBe 3
        }
        it("Tamaño actualizado del repositorio debería ser de 7 objetos"){
            // El mock es de 5 objetos, pero 1 lo actualiza
            // Arrange
            val service = ConsumoServicioIngredientes(ServiceIngredientesMock, repositorioIngredientes)
            service.sincronizar() // Actualizo el repositorio
            val ingredientes = repositorioIngredientes.getAll()

            println(ingredientes)
            // Assert
            ingredientes.size shouldBe 7
        }
        it("Objeto inicial con id 3 debería ser Perejil"){
            // Arrange
            val ingrediente = repositorioIngredientes.getById(3)

            // Assert
            ingrediente.nombre shouldBe "Perejil"
        }
        it("Consumo el servicio externo y testeo update (Actualiza id 3, perejil por Azucar)"){
            // Arrange
            val service = ConsumoServicioIngredientes(ServiceIngredientesMock, repositorioIngredientes)
            service.sincronizar() // Actualizo el repositorio
            val ingrediente = repositorioIngredientes.getById(3)

            // Assert
            ingrediente.nombre shouldBe "Azúcar"
        }
        it("Certifico que todos los objetos del repositorio queden con ID"){
            // Arrange
            val service = ConsumoServicioIngredientes(ServiceIngredientesMock, repositorioIngredientes)
            service.sincronizar() // Actualizo el repositorio
            val ingredientes = repositorioIngredientes.getAll()

            // Assert
            ingredientes.all { it.id != null } shouldBe true
        }
    }
})