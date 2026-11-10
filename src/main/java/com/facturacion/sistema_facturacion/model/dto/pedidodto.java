package com.facturacion.sistema_facturacion.dto;

import java.time.LocalDate;
import com.facturacion.sistema_facturacion.enums.Estadopedido;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class pedidodto {

    private Long id_pedido;
    private Long id_cliente;
    private Long id_usuario;
    private LocalDate fecha;
    private Estadopedido estado;
    private Double total;
    private String observaciones;
}
