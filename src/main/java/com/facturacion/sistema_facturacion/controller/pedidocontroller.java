package com.facturacion.sistema_facturacion.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facturacion.sistema_facturacion.model.dto.pedidodto;
import com.facturacion.sistema_facturacion.mapper.pedidomapper;
import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import com.facturacion.sistema_facturacion.service.PdfFacturaServicio;
import com.facturacion.sistema_facturacion.service.detallepeservice;
import com.facturacion.sistema_facturacion.service.pedidoservice;

@RestController
@RequestMapping("/api/pedidos")
public class pedidocontroller {

    private final pedidoservice service;
    private final pedidomapper mapper;
    private final detallepeservice detalleService;
    private final PdfFacturaServicio pdfFacturaServicio;

    public pedidocontroller(
            pedidoservice service,
            pedidomapper mapper,
            detallepeservice detalleService,
            PdfFacturaServicio pdfFacturaServicio) {

        this.service = service;
        this.mapper = mapper;
        this.detalleService = detalleService;
        this.pdfFacturaServicio = pdfFacturaServicio;
    }

    @PostMapping
    public ResponseEntity<pedidodto> crear(@RequestBody pedidodto dto) {
        pedidoentity entidad = mapper.toEntity(dto);
        entidad.setId_pedido(null);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDTO(service.guardar(entidad)));
    }

    @GetMapping
    public List<pedidodto> listar() {
        return service.listar()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<pedidodto> obtener(@PathVariable Long id) {
        pedidoentity entidad = service.buscarPorId(id);

        if (entidad == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toDTO(entidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<pedidodto> actualizar(
            @PathVariable Long id,
            @RequestBody pedidodto dto) {

        pedidoentity actualizado =
                service.actualizar(id, mapper.toEntity(dto));

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generarPdf(@PathVariable Long id) {

        pedidoentity pedido = service.buscarPorId(id);

        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }

        List<detallepeentity> detalles =
                detalleService.listarPorPedido(id);

        byte[] pdf =
                pdfFacturaServicio.generarPdf(pedido, detalles);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=comprobante-pedido-" + id + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}