package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.productoentity;
import com.facturacion.sistema_facturacion.repository.productorepository;

@Service
public class productservice {

    private final productorepository productoRepository;

    public productservice(productorepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public productoentity guardar(productoentity producto) {
        return productoRepository.save(producto);
    }

    public List<productoentity> listar() {
        return productoRepository.findAll();
    }

    public productoentity buscarPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    public productoentity actualizar(Long id, productoentity producto) {
        if (!productoRepository.existsById(id)) {
            return null;
        }

        producto.setId_producto(id);
        return productoRepository.save(producto);
    }

    public boolean eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            return false;
        }

        productoRepository.deleteById(id);
        return true;
    }
}