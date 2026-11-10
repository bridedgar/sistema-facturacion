package com.facturacion.sistema_facturacion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class usuariodto {

    private Long id_usuario;
    private String nombre;
    private String correo;
    private String contrasena;
    private String rol;
    private Boolean activo;
}
