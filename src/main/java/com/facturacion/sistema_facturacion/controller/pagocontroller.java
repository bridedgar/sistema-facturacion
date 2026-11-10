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

import com.facturacion.sistema_facturacion.dto.pagodto;
import com.facturacion.sistema_facturacion.mapper.pagomapper;
import com.facturacion.sistema_facturacion.model.entity.pagoentity;
import com.facturacion.sistema_facturacion.service.pagoservice;

@RestController
@RequestMapping("/api/pagos")
public class pagocontroller {

    private final pagoservice service;
    private final pagomapper mapper;

    public pagocontroller(pagoservice service, pagomapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<pagodto> crear(@RequestBody pagodto dto) {
        pagoentity entidad = mapper.toEntity(dto);
        entidad.setId_pago(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(service.guardar(entidad)));
    }

    @GetMapping
    public List<pagodto> listar() {
        return service.listar().stream().map(mapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<pagodto> obtener(@PathVariable Long id) {
        pagoentity entidad = service.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(entidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<pagodto> actualizar(@PathVariable Long id, @RequestBody pagodto dto) {
        pagoentity actualizado = service.actualizar(id, mapper.toEntity(dto));
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
