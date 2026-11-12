package com.facturacion.sistema_facturacion.mapper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.facturacion.sistema_facturacion.model.dto.pagodto;
import com.facturacion.sistema_facturacion.model.entity.pagoentity;
import com.facturacion.sistema_facturacion.repository.pedidorepository;

@Component
public class pagomapper {

    private final pedidorepository pedidoRepository;

    public pagomapper(pedidorepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public pagodto toDTO(pagoentity e) {
        if (e == null) {
            return null;
        }
        pagodto d = new pagodto();
        d.setId_pago(e.getId_pago());
        d.setId_pedido(e.getPedido() != null ? e.getPedido().getId_pedido() : null);
        d.setMonto(e.getMonto());
        d.setMetodo(e.getMetodo());
        d.setEstado(e.getEstado());
        d.setFecha(e.getFecha());
        return d;
    }

    public pagoentity toEntity(pagodto d) {
        if (d == null) {
            return null;
        }
        pagoentity e = new pagoentity();
        e.setId_pago(d.getId_pago());
        e.setPedido(resolver(d.getId_pedido(), pedidoRepository, "Pedido"));
        e.setMonto(d.getMonto());
        e.setMetodo(d.getMetodo());
        e.setEstado(d.getEstado());
        e.setFecha(d.getFecha());
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
