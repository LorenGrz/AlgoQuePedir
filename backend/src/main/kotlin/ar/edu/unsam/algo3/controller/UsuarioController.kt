package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.dto.UsuarioDTO
import ar.edu.unsam.algo3.helpers.UsuarioMapper
import ar.edu.unsam.algo3.service.UsuarioService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("*")
@RequestMapping("/usuario")
class UsuarioController(private val usuarioService: UsuarioService, private val usuarioMapper: UsuarioMapper) {
    @GetMapping("/{id}")
    fun usuarioPorId(@PathVariable id: Int) = usuarioMapper.toDto(usuarioService.usuarioById(id))

    @PutMapping("/{id}")
    fun actualizarUsuario(@PathVariable id: Int, @RequestBody usuario: UsuarioDTO) {
        usuarioService.actualizarUsuario(usuarioMapper.fromDto(usuario, id))
    }

}