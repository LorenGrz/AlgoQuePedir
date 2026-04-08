package ar.edu.unsam.algo3.loaders
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.repository.MenuRepository
import ar.edu.unsam.algo3.service.IngredienteService
import ar.edu.unsam.algo3.service.LocalService
import config.EnvironmentVariables
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
@Order(3)
class MenuDataLoader(private val menuRepository: MenuRepository, private val ingredienteService: IngredienteService, val localService: LocalService) : CommandLineRunner {
    override fun run(vararg args: String?) {
        val localMock1 = localService.localPorId(1)
        val localMock2 = localService.localPorId(2)
        val localMock3 = localService.localPorId(3)
        val localMock4 = localService.localPorId(4)

        val pastaCremosa = Plato(
            nombre = "Pasta Cremosa",
            local = localMock4,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(8),
                ingredienteService.ingredienteById(14),
                ingredienteService.ingredienteById(9)
            )
        ).apply {
            descripcion = "Deliciosa pasta con salsa cremosa"
            valorBase = 2500.0
            img = EnvironmentVariables.API_URL + "/img/pasta.jpg"
            lanzamiento = LocalDate.of(2024, 1, 1)
            popular = true
        }
        val alitasPicantes = Plato(
            nombre = "Alitas Picantes",
            local = localMock2,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(2),
                    ingredienteService.ingredienteById(10),
                    ingredienteService.ingredienteById(14)
            )
        ).apply {
            descripcion = "Alitas de pollo picantes con salsa para mojar"
            valorBase = 2800.0
            img = EnvironmentVariables.API_URL + "/img/alitas.jpg"
            lanzamiento = LocalDate.of(2024, 1, 1)
            popular = true
        }
        val ensaladaHuerta = Plato(
            nombre = "Ensalada de la Huerta",
            local = localMock4,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(1),
                ingredienteService.ingredienteById(6),
                ingredienteService.ingredienteById(10),
                ingredienteService.ingredienteById(15)
            )
        ).apply {
            descripcion = "Ensalada fresca con hojas mixtas y vinagreta"
            valorBase = 1800.0
            img = EnvironmentVariables.API_URL + "/img/ensalada.jpg"
            popular = true
        }
        val hamburguesaConQueso = Plato(
            nombre = "Hamburguesa con Queso",
            local = localMock4,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(6),
                ingredienteService.ingredienteById(7),
                ingredienteService.ingredienteById(9),
                ingredienteService.ingredienteById(16),
                ingredienteService.ingredienteById(17)
            )
        ).apply {
            descripcion = "Hamburguesa clásica con queso y papas fritas"
            valorBase = 3200.0
            img = EnvironmentVariables.API_URL + "/img/hamburga.jpg"
            platoDeAutor = true
            lanzamiento = LocalDate.of(2024, 1, 1)
        }
        val pescadoPapasFritas = Plato(
            nombre = "Pescado y Papas Fritas",
            local = localMock2,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(3),
                ingredienteService.ingredienteById(10),
                ingredienteService.ingredienteById(16),
                ingredienteService.ingredienteById(18),
            )
        ).apply {
            descripcion = "Pescado crujiente y papas fritas con salsa tártara"
            valorBase = 3100.0
            img = EnvironmentVariables.API_URL + "/img/pescado.jpg"
        }
        val pizzaVegetariana = Plato(
            nombre = "Pizza Vegetariana",
            local = localMock4,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(1),
                ingredienteService.ingredienteById(9),
                ingredienteService.ingredienteById(10),
                ingredienteService.ingredienteById(13),
            )
        ).apply {
            descripcion = "Pizza vegetariana con ingredientes variados"
            valorBase = 3000.0
            img = EnvironmentVariables.API_URL + "/img/pizza.jpg"
        }
        val pastelChocolate = Plato(
            nombre = "Pastel de Chocolate",
            local = localMock2,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(14),
                ingredienteService.ingredienteById(19),
                ingredienteService.ingredienteById(20),
                ingredienteService.ingredienteById(21),
                ingredienteService.ingredienteById(22)
            )
        ).apply {
            descripcion = "Pastel de chocolate rico con glaseado"
            valorBase = 2600.0
            img = EnvironmentVariables.API_URL + "/img/pastel.jpg"
        }

        val hamburguesaConQueso2 = Plato(
            nombre = "Hamburguesa con Queso",
            local = localMock1,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(6),
                ingredienteService.ingredienteById(7),
                ingredienteService.ingredienteById(9),
                ingredienteService.ingredienteById(16),
                ingredienteService.ingredienteById(17)
            )
        ).apply {
            descripcion = "Hamburguesa clásica con queso y papas fritas"
            valorBase = 3200.0
            img = EnvironmentVariables.API_URL + "/img/hamburga.jpg"
            platoDeAutor = true
            lanzamiento = LocalDate.of(2024, 1, 1)
        }
        val pizzaVegetariana2 = Plato(
            nombre = "Pizza Vegetariana",
            local = localMock3,
            listaIngredientes = mutableListOf(
                ingredienteService.ingredienteById(1),
                ingredienteService.ingredienteById(9),
                ingredienteService.ingredienteById(10),
                ingredienteService.ingredienteById(13),
            )
        ).apply {
            descripcion = "Pizza vegetariana con ingredientes variados"
            valorBase = 3000.0
            img = EnvironmentVariables.API_URL + "/img/pizza.jpg"
        }

        menuRepository.create(pastaCremosa)
        menuRepository.create(alitasPicantes)
        menuRepository.create(ensaladaHuerta)
        menuRepository.create(hamburguesaConQueso)
        menuRepository.create(pescadoPapasFritas)
        menuRepository.create(pizzaVegetariana)
        menuRepository.create(pastelChocolate)
        menuRepository.create(hamburguesaConQueso2)
        menuRepository.create(pizzaVegetariana2)

        println("✅ Datos del menu mockeados en memoria")
    }
}