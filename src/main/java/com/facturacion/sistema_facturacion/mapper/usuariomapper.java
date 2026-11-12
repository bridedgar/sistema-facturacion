package com.facturacion.sistema_facturacion.mapper;

import org.springframework.stereotype.Component;

import com.facturacion.sistema_facturacion.model.dto.usuariodto;
import com.facturacion.sistema_facturacion.model.entity.usuarioentity;

@Component
public class usuariomapper {

    /** La contraseña nunca se devuelve al cliente. */
    public usuariodto toDTO(usuarioentity e) {
        if (e == null) {
            return null;
        }
        usuariodto d = new usuariodto();
        d.setId_usuario(e.getId_usuario());
        d.setNombre(e.getNombre());
        d.setCorreo(e.getCorreo());
        d.setRol(e.getRol());
        d.setActivo(e.getActivo());
        return d;
    }

    public usuarioentity toEntity(usuariodto d) {
        if (d == null) {
            return null;
        }
        usuarioentity e = new usuarioentity();
        e.setId_usuario(d.getId_usuario());
        e.setNombre(d.getNombre());
        e.setCorreo(d.getCorreo());
        e.setContrasena(d.getContrasena());
        e.setRol(d.getRol());
        e.setActivo(d.getActivo());
        return e;
    }
}
