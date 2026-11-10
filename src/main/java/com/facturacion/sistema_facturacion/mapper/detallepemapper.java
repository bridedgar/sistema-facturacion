package com.facturacion.sistema_facturacion.mapper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.facturacion.sistema_facturacion.dto.detallepedto;
import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import com.facturacion.sistema_facturacion.repository.pedidorepository;
import com.facturacion.sistema_facturacion.repository.productorepository;

@Component
public class detallepemapper {

    private final pedidorepository pedidoRepository;
    private final productorepository productoRepository;

    public detallepemapper(pedidorepository pedidoRepository, productorepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    public detallepedto toDTO(detallepeentity e) {
        if (e == null) {
            return null;
        }
        detallepedto d = new detallepedto();
        d.setId_detalle(e.getId_detalle());
        d.setId_pedido(e.getPedido() != null ? e.getPedido().getId_pedido() : null);
        d.setId_producto(e.getProducto() != null ? e.getProducto().getId_producto() : null);
        d.setCantidad(e.getCantidad());
        d.setPrecio(e.getPrecio());
        return d;
    }

    public detallepeentity toEntity(detallepedto d) {
        if (d == null) {
            return null;
        }
        detallepeentity e = new detallepeentity();
        e.setId_detalle(d.getId_detalle());
        e.setPedido(resolver(d.getId_pedido(), pedidoRepository, "Pedido"));
        e.setProducto(resolver(d.getId_producto(), productoRepository, "Producto"));
        e.setCantidad(d.getCantidad());
        e.setPrecio(d.getPrecio());
        return e;
    }

    private <T> T resolver(Long id, JpaRepository<T, Long> repo, String nombre) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST, nombre + " no existe con id " + id));
    }
}
