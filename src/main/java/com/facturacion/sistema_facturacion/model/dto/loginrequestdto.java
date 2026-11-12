package com.facturacion.sistema_facturacion.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class loginrequestdto {

    private String correo;
    private String contrasena;
}
