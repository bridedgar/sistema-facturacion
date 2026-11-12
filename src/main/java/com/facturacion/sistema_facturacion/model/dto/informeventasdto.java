package com.facturacion.sistema_facturacion.model.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class informeventasdto {

    private Long totalPedidos;
    private Double totalVentas;
    private Double totalPagado;
    private Map<String, Long> pedidosPorEstado;
}
