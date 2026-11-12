package com.facturacion.sistema_facturacion.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facturacion.sistema_facturacion.model.dto.usuariodto;
import com.facturacion.sistema_facturacion.mapper.usuariomapper;
import com.facturacion.sistema_facturacion.model.entity.usuarioentity;
import com.facturacion.sistema_facturacion.service.usuarioservice;

@RestController
@RequestMapping("/api/usuarios")
public class usuariocontroller {

    private final usuarioservice service;
    private final usuariomapper mapper;

    public usuariocontroller(usuarioservice service, usuariomapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<usuariodto> crear(@RequestBody usuariodto dto) {
        usuarioentity entidad = mapper.toEntity(dto);
        entidad.setId_usuario(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(service.guardar(entidad)));
    }

    @GetMapping
    public List<usuariodto> listar() {
        return service.listar().stream().map(mapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<usuariodto> obtener(@PathVariable Long id) {
        usuarioentity entidad = service.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(entidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<usuariodto> actualizar(@PathVariable Long id, @RequestBody usuariodto dto) {
        usuarioentity actualizado = service.actualizar(id, mapper.toEntity(dto));
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
