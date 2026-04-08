package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.dto.CardLocalDTO
import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.service.LocalService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/local")
class LocalController(val localService: LocalService, val localMapper: LocalMapper) {
    @GetMapping("/{id}")
    fun localPorId(@PathVariable id: Int) = localMapper.toDto(localService.localPorId(id))

    @PutMapping("/{id}")
    fun actualizarLocal(@PathVariable id: Int, @RequestBody local: LocalDTO)
    = localService.actualizarLocal(localMapper.fromDto(local, id))

    @GetMapping("/allResumen")
    fun resumenLocales() = localService.getLocales().map { localMapper.toResumenDto(it) }

    @GetMapping("/locales/{userId}")
    fun cardsLocales(@PathVariable userId: Int): List<CardLocalDTO> {
        return localService.getLocalesParaUsuario(userId)
    }

    @GetMapping("/{userId}/search")
    fun cardsLocalesFiltrados(
        @PathVariable userId: Int,
        @RequestParam(required=false, defaultValue="") search: String,
        @RequestParam(required=false, defaultValue="false") onlyNearby: Boolean
    ) : List<CardLocalDTO> {
        return localService.getLocalesFiltrados(userId, search, onlyNearby)
    }
}