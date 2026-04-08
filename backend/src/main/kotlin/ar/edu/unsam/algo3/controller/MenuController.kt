package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.dto.PlatoRequest
import ar.edu.unsam.algo3.helpers.MenuMapper
import ar.edu.unsam.algo3.helpers.PlatoMapper
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.MenuService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/menu")
class MenuController(val menuService: MenuService, val localService: LocalService,
                     val menuMapper: MenuMapper,val platoMapper: PlatoMapper) {
    @GetMapping
    fun getPlatos() = menuMapper.toDto(menuService.getPlatos())

    @GetMapping("/plato/{id}")
    fun platoPorId(@PathVariable id: Int) = platoMapper.toDto(menuService.platoPorId(id))

    @PutMapping("/plato/{id}")
    fun actualizarPlato(@PathVariable id: Int, @RequestBody req: PlatoRequest){
        val local: Local = localService.localPorId(req.localId)
        return menuService.actualizarPlato(platoMapper.fromDTO(req.plato, id, local))
    }

    @PostMapping("/plato")
    fun crearPlato(@RequestBody req: PlatoRequest){
        val local: Local = localService.localPorId(req.localId)
        return menuService.crearPlato(platoMapper.fromDTO(platoDTO = req.plato, local = local))
    }
}
