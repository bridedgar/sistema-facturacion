package com.facturacion.sistema_facturacion.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facturacion.sistema_facturacion.model.dto.loginrequestdto;
import com.facturacion.sistema_facturacion.model.dto.loginresponsedto;
import com.facturacion.sistema_facturacion.model.entity.usuarioentity;
import com.facturacion.sistema_facturacion.service.usuarioservice;

@RestController
@RequestMapping("/api/auth")
public class authcontroller {

    private final usuarioservice usuarioService;

    public authcontroller(usuarioservice usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<loginresponsedto> login(@RequestBody loginrequestdto request) {
        usuarioentity usuario = usuarioService.autenticar(request.getCorreo(), request.getContrasena());

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new loginresponsedto(null, null, null, null, "Credenciales inválidas"));
        }

        return ResponseEntity.ok(new loginresponsedto(
                usuario.getId_usuario(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol(),
                "Inicio de sesión exitoso"));
    }
}
