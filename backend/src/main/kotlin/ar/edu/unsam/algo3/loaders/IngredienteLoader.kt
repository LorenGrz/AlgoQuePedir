package ar.edu.unsam.algo3.loaders
import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import ar.edu.unsam.algo3.repository.IngredienteRepository
import org.springframework.core.annotation.Order

@Component
@Order(1)
class IngredienteDataLoader(private val ingredienteRepository: IngredienteRepository) : CommandLineRunner {
    override fun run(vararg args: String?) {
        ingredienteRepository.create(Ingrediente(
            nombre = "Tomate",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 20.0
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Pechuga de pollo",
            grupo = GrupoAlimenticio.PROTEINAS,
            origenAnimal = true,
            costoMercado = 40.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Arroz",
            grupo = GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            origenAnimal = false,
            costoMercado = 10.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Leche",
            grupo = GrupoAlimenticio.LACTEOS,
            origenAnimal = true,
            costoMercado = 20.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Palta",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 1.50
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Lechuga",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 20.0
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Carne de Res",
            grupo = GrupoAlimenticio.PROTEINAS,
            origenAnimal = true,
            costoMercado = 50.0
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Pasta",
            grupo = GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            origenAnimal = false,
            costoMercado = 10.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Queso Cheddar",
            grupo = GrupoAlimenticio.LACTEOS,
            origenAnimal = true,
            costoMercado = 25.0
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Cebolla",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 11.50
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Manzana",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 10.50
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Carne de cerdo",
            grupo = GrupoAlimenticio.PROTEINAS,
            origenAnimal = true,
            costoMercado = 55.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Masa de pizza",
            grupo = GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            origenAnimal = false,
            costoMercado = 100.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Manteca",
            grupo = GrupoAlimenticio.LACTEOS,
            origenAnimal = true,
            costoMercado = 2.00
        ))
        ingredienteRepository.create(Ingrediente(
            nombre = "Pepino",
            grupo = GrupoAlimenticio.FRUTAS_Y_VERDURAS,
            origenAnimal = false,
            costoMercado = 1.5
        ))
        ingredienteRepository.create(Ingrediente(
            "Pan de hamburguesa",
            100.0,
            GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            false
        ))
        ingredienteRepository.create(Ingrediente(
            "Papa",
            80.0,
            GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            false
        ))
        ingredienteRepository.create(Ingrediente(
            "Filete de merluza",
            280.0,
            GrupoAlimenticio.PROTEINAS,
            true
        ))
        ingredienteRepository.create(Ingrediente(
            "Harina",
            60.0,
            GrupoAlimenticio.CEREALES_Y_TUBERCULOS,
            false))
        ingredienteRepository.create(Ingrediente(
            "Azúcar",
            50.0,
            GrupoAlimenticio.AZUCARES_Y_DULCES,
            false))
        ingredienteRepository.create(Ingrediente(
            "Cacao",
            100.0,
            GrupoAlimenticio.AZUCARES_Y_DULCES,
            false))
        ingredienteRepository.create(Ingrediente(
            "Huevos",
            120.0,
            GrupoAlimenticio.PROTEINAS,
            true))

        println("✅ Ingredientes mockeados en memoria")
        println(ingredienteRepository.getAll())
    }
}