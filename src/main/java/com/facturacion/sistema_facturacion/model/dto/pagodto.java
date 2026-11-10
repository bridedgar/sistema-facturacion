package com.facturacion.sistema_facturacion.dto;

import java.time.LocalDate;
import com.facturacion.sistema_facturacion.enums.Estadopago;
import com.facturacion.sistema_facturacion.enums.metodopago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class pagodto {

    private Long id_pago;
    private Long id_pedido;
    private Double monto;
    private metodopago metodo;
    private Estadopago estado;
    private LocalDate fecha;
}
