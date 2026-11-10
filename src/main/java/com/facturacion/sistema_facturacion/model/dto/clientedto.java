package com.facturacion.sistema_facturacion.dto;

import com.facturacion.sistema_facturacion.enums.tipocliente;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class clientedto {

    private Long id_cliente;
    private String nombre;
    private String documento;
    private String telefono;
    private String correo;
    private String direccion;
    private String ciudad;
    private tipocliente tipo_cliente;
}
