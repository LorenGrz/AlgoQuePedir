package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.helpers.IngredienteMapper
import ar.edu.unsam.algo3.service.IngredienteService
import ar.edu.unsam.algo3.dto.IngredienteDTO
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
class IngredienteController(val ingredienteService: IngredienteService, private val ingredienteMapper: IngredienteMapper) {

    @GetMapping("/ingredientes")
    fun getIngredientes() = ingredienteService.getIngredientes().map{ ing: Ingrediente -> ingredienteMapper.toDto(ing) }
   
    @GetMapping("/ingrediente/{id}")
    fun obtenerIngredientePorId(@PathVariable id: Int): IngredienteDTO {
        val ingrediente = ingredienteService.ingredienteById(id)
        return ingredienteMapper.toDto(ingrediente)
    }

    @PostMapping("/ingrediente")
    fun crearIngrediente(@RequestBody ingredienteDto: IngredienteDTO): IngredienteDTO {
        val ingrediente = ingredienteMapper.fromDto(ingredienteDto) 
        ingredienteService.crearIngrediente(ingrediente)
        return ingredienteMapper.toDto(ingrediente)
    }

    @PutMapping("/ingrediente")
    fun actualizarIngrediente(@RequestBody ingredienteDto: IngredienteDTO): IngredienteDTO {
        val ingrediente = ingredienteMapper.fromDto(ingredienteDto)
        ingredienteService.actualizarIngrediente(ingrediente)
        return ingredienteMapper.toDto(ingrediente)
    }

    @DeleteMapping("/ingrediente/eliminar")
    fun eliminar(@RequestBody ingrediente: IngredienteDTO) = ingredienteService.eliminar(ingredienteMapper.fromDto(ingrediente))
}
