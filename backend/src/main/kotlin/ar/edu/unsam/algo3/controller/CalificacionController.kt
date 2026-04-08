package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.CalificacionRequestDTO
import ar.edu.unsam.algo3.dto.CalificacionResponseDTO
import ar.edu.unsam.algo3.dto.ResumenLocalDTO
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.service.CalificacionService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/calificaciones")
class CalificacionController(
    private val calificacionService: CalificacionService,
    private val localMapper: LocalMapper
) {
    //Locales  que se pueden calificar segun un usuario
    @GetMapping("/{usuarioId}/pendientes")
    fun pendientes(@PathVariable usuarioId: Int): List<ResumenLocalDTO> =
        calificacionService.localesPendientes(usuarioId).map { local -> localMapper.toResumenDto(local) }

    //Calificar  un local
    @PostMapping("/{usuarioId}/calificar")
    fun calificar(@PathVariable usuarioId: Int, @RequestBody respuesta: CalificacionRequestDTO ): CalificacionResponseDTO {
        val (ok, local) = calificacionService.calificar(usuarioId, respuesta)
        return CalificacionResponseDTO(
            ok = ok, 
            puntajePromedio = local.puntuacion(),
            mensaje = if (ok) "Calificación exitosa" else "No se pudo calificar el local"
        )
    }
}