package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.usuarioentity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface usuariorepository extends JpaRepository<usuarioentity, Long> {
}
