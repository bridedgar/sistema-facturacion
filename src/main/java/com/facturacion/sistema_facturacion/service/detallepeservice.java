package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import com.facturacion.sistema_facturacion.repository.detalleperepository;

@Service
public class detallepeservice {

    private final detalleperepository detalleRepository;

    public detallepeservice(detalleperepository detalleRepository) {
        this.detalleRepository = detalleRepository;
    }

    public detallepeentity guardar(detallepeentity detalle) {
        return detalleRepository.save(detalle);
    }

    public List<detallepeentity> listar() {
        return detalleRepository.findAll();
    }

    public detallepeentity buscarPorId(Long id) {
        return detalleRepository.findById(id).orElse(null);
    }

    public List<detallepeentity> listarPorPedido(Long idPedido) {
    return detalleRepository.listarPorPedido(idPedido);
    }

    public detallepeentity actualizar(Long id, detallepeentity detalle) {
        if (!detalleRepository.existsById(id)) {
            return null;
        }

        detalle.setId_detalle(id);
        return detalleRepository.save(detalle);
    }

    public boolean eliminar(Long id) {
        if (!detalleRepository.existsById(id)) {
            return false;
        }

        detalleRepository.deleteById(id);
        return true;
    }
}