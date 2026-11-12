package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface pedidorepository extends JpaRepository<pedidoentity, Long> {
}
