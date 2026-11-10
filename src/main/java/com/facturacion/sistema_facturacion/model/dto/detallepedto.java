package com.facturacion.sistema_facturacion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class detallepedto {

    private Long id_detalle;
    private Long id_pedido;
    private Long id_producto;
    private Integer cantidad;
    private Double precio;
}
