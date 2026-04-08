package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.helpers.MenuMapper
import ar.edu.unsam.algo3.service.LocalService
import ar.edu.unsam.algo3.service.MenuService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/localpublico")
class PublicLocalController(
    val localService: LocalService,
    val localMapper: LocalMapper,
    val menuService: MenuService,
    val menuMapper: MenuMapper) {

    @GetMapping("/{id}")
    fun localPorId(@PathVariable id: Int) = localMapper.toPublicDto(localService.localPorId(id))

    @GetMapping("/{id}/menu")
    fun menuPorLocal(
        @PathVariable id: Int,
        @RequestParam(required = false) userId: Int?) =
        menuMapper.toDto(menuService.platosPorLocal(id, userId))
}