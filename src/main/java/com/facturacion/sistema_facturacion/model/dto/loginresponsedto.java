package com.facturacion.sistema_facturacion.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class loginresponsedto {

    private Long id_usuario;
    private String nombre;
    private String correo;
    private String rol;
    private String mensaje;
}
