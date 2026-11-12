package com.facturacion.sistema_facturacion.repository;

import com.facturacion.sistema_facturacion.model.entity.usuarioentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface usuariorepository extends JpaRepository<usuarioentity, Long> {

    Optional<usuarioentity> findByCorreoAndContrasena(String correo, String contrasena);
}