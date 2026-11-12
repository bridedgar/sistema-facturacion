package com.facturacion.sistema_facturacion.mapper;

import org.springframework.stereotype.Component;

import com.facturacion.sistema_facturacion.model.dto.productodto;
import com.facturacion.sistema_facturacion.model.entity.productoentity;

@Component
public class Productomapper {

    public productodto toDTO(productoentity e) {
        if (e == null) {
            return null;
        }
        productodto d = new productodto();
        d.setId_producto(e.getId_producto());
        d.setNombre(e.getNombre());
        d.setTipo(e.getTipo());
        d.setVariedad(e.getVariedad());
        d.setDescripcion(e.getDescripcion());
        d.setPrecio(e.getPrecio());
        d.setUnidad_medida(e.getUnidad_medida());
        d.setStock(e.getStock());
        d.setImagen(e.getImagen());
        d.setActivo(e.getActivo());
        return d;
    }

    public productoentity toEntity(productodto d) {
        if (d == null) {
            return null;
        }
        productoentity e = new productoentity();
        e.setId_producto(d.getId_producto());
        e.setNombre(d.getNombre());
        e.setTipo(d.getTipo());
        e.setVariedad(d.getVariedad());
        e.setDescripcion(d.getDescripcion());
        e.setPrecio(d.getPrecio());
        e.setUnidad_medida(d.getUnidad_medida());
        e.setStock(d.getStock());
        e.setImagen(d.getImagen());
        e.setActivo(d.getActivo());
        return e;
    }
}
