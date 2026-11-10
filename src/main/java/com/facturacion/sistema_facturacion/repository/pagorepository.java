package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.pagoentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface pagorepository extends JpaRepository<pagoentity, Long> {
}