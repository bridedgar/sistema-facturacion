package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface detalleperepository extends JpaRepository<detallepeentity, Long> {
}