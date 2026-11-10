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

import com.facturacion.sistema_facturacion.dto.productodto;
import com.facturacion.sistema_facturacion.mapper.Productomapper;
import com.facturacion.sistema_facturacion.model.entity.productoentity;
import com.facturacion.sistema_facturacion.service.productservice;

@RestController
@RequestMapping("/api/productos")
public class productocontroller {

    private final productservice service;
    private final Productomapper mapper;

    public productocontroller(productservice service, Productomapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<productodto> crear(@RequestBody productodto dto) {
        productoentity entidad = mapper.toEntity(dto);
        entidad.setId_producto(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(service.guardar(entidad)));
    }

    @GetMapping
    public List<productodto> listar() {
        return service.listar().stream().map(mapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<productodto> obtener(@PathVariable Long id) {
        productoentity entidad = service.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(entidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<productodto> actualizar(@PathVariable Long id, @RequestBody productodto dto) {
        productoentity actualizado = service.actualizar(id, mapper.toEntity(dto));
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
