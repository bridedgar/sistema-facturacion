package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import com.facturacion.sistema_facturacion.repository.pedidorepository;

@Service
public class pedidoservice {

    private final pedidorepository pedidoRepository;

    public pedidoservice(pedidorepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public pedidoentity guardar(pedidoentity pedido) {
        return pedidoRepository.save(pedido);
    }

    public List<pedidoentity> listar() {
        return pedidoRepository.findAll();
    }

    public pedidoentity buscarPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public pedidoentity actualizar(Long id, pedidoentity pedido) {
        if (!pedidoRepository.existsById(id)) {
            return null;
        }

        pedido.setId_pedido(id);
        return pedidoRepository.save(pedido);
    }

    public boolean eliminar(Long id) {
        if (!pedidoRepository.existsById(id)) {
            return false;
        }

        pedidoRepository.deleteById(id);
        return true;
    }
}