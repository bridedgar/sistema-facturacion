package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.productoentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productorepository extends JpaRepository<productoentity, Long> {
}
