package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.pagoentity;
import com.facturacion.sistema_facturacion.repository.pagorepository;

@Service
public class pagoservice {

    private final pagorepository pagoRepository;

    public pagoservice(pagorepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public pagoentity guardar(pagoentity pago) {
        return pagoRepository.save(pago);
    }

    public List<pagoentity> listar() {
        return pagoRepository.findAll();
    }

    public pagoentity buscarPorId(Long id) {
        return pagoRepository.findById(id).orElse(null);
    }

    public pagoentity actualizar(Long id, pagoentity pago) {
        if (!pagoRepository.existsById(id)) {
            return null;
        }

        pago.setId_pago(id);
        return pagoRepository.save(pago);
    }

    public boolean eliminar(Long id) {
        if (!pagoRepository.existsById(id)) {
            return false;
        }

        pagoRepository.deleteById(id);
        return true;
    }
}
