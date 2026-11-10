package com.facturacion.sistema_facturacion.mapper;

import org.springframework.stereotype.Component;

import com.facturacion.sistema_facturacion.dto.clientedto;
import com.facturacion.sistema_facturacion.model.entity.clienteentity;

@Component
public class clientemapper {

    public clientedto toDTO(clienteentity e) {
        if (e == null) {
            return null;
        }
        clientedto d = new clientedto();
        d.setId_cliente(e.getId_cliente());
        d.setNombre(e.getNombre());
        d.setDocumento(e.getDocumento());
        d.setTelefono(e.getTelefono());
        d.setCorreo(e.getCorreo());
        d.setDireccion(e.getDireccion());
        d.setCiudad(e.getCiudad());
        d.setTipo_cliente(e.getTipo_cliente());
        return d;
    }

    public clienteentity toEntity(clientedto d) {
        if (d == null) {
            return null;
        }
        clienteentity e = new clienteentity();
        e.setId_cliente(d.getId_cliente());
        e.setNombre(d.getNombre());
        e.setDocumento(d.getDocumento());
        e.setTelefono(d.getTelefono());
        e.setCorreo(d.getCorreo());
        e.setDireccion(d.getDireccion());
        e.setCiudad(d.getCiudad());
        e.setTipo_cliente(d.getTipo_cliente());
        return e;
    }
}
