package com.facturacion.sistema_facturacion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class productodto {

    private Long id_producto;
    private String nombre;
    private String tipo;
    private String variedad;
    private String descripcion;
    private Double precio;
    private String unidad_medida;
    private Integer stock;
    private String imagen;
    private Boolean activo;
}
