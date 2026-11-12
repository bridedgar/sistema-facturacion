package com.facturacion.sistema_facturacion.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.dto.informeventasdto;
import com.facturacion.sistema_facturacion.enums.Estadopago;
import com.facturacion.sistema_facturacion.enums.Estadopedido;
import com.facturacion.sistema_facturacion.model.entity.pagoentity;
import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import com.facturacion.sistema_facturacion.model.entity.productoentity;
import com.facturacion.sistema_facturacion.repository.pagorepository;
import com.facturacion.sistema_facturacion.repository.pedidorepository;
import com.facturacion.sistema_facturacion.repository.productorepository;

@Service
public class informeservice {

    private final pedidorepository pedidoRepository;
    private final pagorepository pagoRepository;
    private final productorepository productoRepository;

    public informeservice(pedidorepository pedidoRepository,
                          pagorepository pagoRepository,
                          productorepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.productoRepository = productoRepository;
    }

    public informeventasdto ventas() {
        List<pedidoentity> pedidos = pedidoRepository.findAll();

        double totalVentas = pedidos.stream()
                .filter(p -> p.getEstado() != Estadopedido.CANCELADO && p.getTotal() != null)
                .mapToDouble(pedidoentity::getTotal)
                .sum();

        double totalPagado = pagoRepository.findAll().stream()
                .filter(p -> p.getEstado() == Estadopago.PAGADO && p.getMonto() != null)
                .mapToDouble(pagoentity::getMonto)
                .sum();

        Map<String, Long> porEstado = new LinkedHashMap<>();
        for (Estadopedido estado : Estadopedido.values()) {
            porEstado.put(estado.name(), 0L);
        }
        pedidos.stream()
                .filter(p -> p.getEstado() != null)
                .collect(Collectors.groupingBy(p -> p.getEstado().name(), Collectors.counting()))
                .forEach(porEstado::put);

        return new informeventasdto((long) pedidos.size(), totalVentas, totalPagado, porEstado);
    }

    public List<productoentity> productosStockBajo(int minimo) {
        return productoRepository.findAll().stream()
                .filter(p -> p.getStock() != null && p.getStock() <= minimo)
                .toList();
    }
}
