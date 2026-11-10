package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.clienteentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface clienterepository extends JpaRepository<clienteentity, Long> {
}
