package com.facturacion.sistema_facturacion.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.facturacion.sistema_facturacion.model.dto.informeventasdto;
import com.facturacion.sistema_facturacion.model.dto.productodto;
import com.facturacion.sistema_facturacion.mapper.Productomapper;
import com.facturacion.sistema_facturacion.service.informeservice;

@RestController
@RequestMapping("/api/informes")
public class informecontroller {

    private final informeservice informeService;
    private final Productomapper productoMapper;

    public informecontroller(informeservice informeService, Productomapper productoMapper) {
        this.informeService = informeService;
        this.productoMapper = productoMapper;
    }

    @GetMapping("/ventas")
    public informeventasdto ventas() {
        return informeService.ventas();
    }

    @GetMapping("/stock-bajo")
    public List<productodto> stockBajo(@RequestParam(defaultValue = "5") int minimo) {
        return informeService.productosStockBajo(minimo).stream().map(productoMapper::toDTO).toList();
    }
}
