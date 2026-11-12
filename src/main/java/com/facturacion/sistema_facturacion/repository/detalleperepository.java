package com.facturacion.sistema_facturacion.repository;

import java.util.List;

import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface detalleperepository extends JpaRepository<detallepeentity, Long> {

    @Query("SELECT d FROM detallepeentity d WHERE d.pedido.id_pedido = :idPedido")
    List<detallepeentity> listarPorPedido(@Param("idPedido") Long idPedido);
}