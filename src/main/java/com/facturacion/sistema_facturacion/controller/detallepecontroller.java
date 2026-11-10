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

import com.facturacion.sistema_facturacion.dto.detallepedto;
import com.facturacion.sistema_facturacion.mapper.detallepemapper;
import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import com.facturacion.sistema_facturacion.service.detallepeservice;

@RestController
@RequestMapping("/api/detalles")
public class detallepecontroller {

    private final detallepeservice service;
    private final detallepemapper mapper;

    public detallepecontroller(detallepeservice service, detallepemapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<detallepedto> crear(@RequestBody detallepedto dto) {
        detallepeentity entidad = mapper.toEntity(dto);
        entidad.setId_detalle(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(service.guardar(entidad)));
    }

    @GetMapping
    public List<detallepedto> listar() {
        return service.listar().stream().map(mapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<detallepedto> obtener(@PathVariable Long id) {
        detallepeentity entidad = service.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(entidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<detallepedto> actualizar(@PathVariable Long id, @RequestBody detallepedto dto) {
        detallepeentity actualizado = service.actualizar(id, mapper.toEntity(dto));
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
