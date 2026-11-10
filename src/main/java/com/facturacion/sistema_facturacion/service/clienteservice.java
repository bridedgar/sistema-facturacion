package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.clienteentity;
import com.facturacion.sistema_facturacion.repository.clienterepository;

@Service
public class clienteservice {

    private final clienterepository clienteRepository;

    public clienteservice(clienterepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public clienteentity guardar(clienteentity cliente) {
        return clienteRepository.save(cliente);
    }

    public List<clienteentity> listar() {
        return clienteRepository.findAll();
    }

    public clienteentity buscarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public clienteentity actualizar(Long id, clienteentity cliente) {
        if (!clienteRepository.existsById(id)) {
            return null;
        }

        cliente.setId_cliente(id);
        return clienteRepository.save(cliente);
    }

    public boolean eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            return false;
        }

        clienteRepository.deleteById(id);
        return true;
    }
}