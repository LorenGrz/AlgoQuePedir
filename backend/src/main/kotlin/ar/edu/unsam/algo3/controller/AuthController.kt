package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.dto.LoginLocalDTO
import ar.edu.unsam.algo3.dto.RetornoLocalDTO
import ar.edu.unsam.algo3.dto.LoginUsuarioDTO
import ar.edu.unsam.algo3.dto.RetornoUsuarioDTO
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.helpers.UsuarioMapper
import ar.edu.unsam.algo3.service.AuthService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
class AuthController(val authService: AuthService, val localMapper: LocalMapper, val usuarioMapper: UsuarioMapper) {
    @PostMapping("/local/register")
    fun registrarLocal(@RequestBody loginLocalDTO: LoginLocalDTO) : RetornoLocalDTO =
        localMapper.toIdDTO(authService.registerLocal(loginLocalDTO))

    @PostMapping("/local/login")
    fun loguearLocal(@RequestBody loginLocalDTO: LoginLocalDTO): RetornoLocalDTO =
        localMapper.toIdDTO(authService.loginLocal(loginLocalDTO))

    @PostMapping("/usuario/register")
    fun registrarUsuario(@RequestBody registrarUsuarioDTO: LoginUsuarioDTO): RetornoUsuarioDTO =
        usuarioMapper.toRetornoDTO(authService.registrarUsuario(registrarUsuarioDTO))

    @PostMapping("/usuario/login")
    fun loguearUsuario(@RequestBody loguearUsuarioDTO: LoginUsuarioDTO): RetornoUsuarioDTO =
        usuarioMapper.toRetornoDTO(authService.loguearUsuario(loguearUsuarioDTO))
}