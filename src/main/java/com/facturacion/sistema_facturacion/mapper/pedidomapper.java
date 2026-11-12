package com.facturacion.sistema_facturacion.mapper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.facturacion.sistema_facturacion.model.dto.pedidodto;
import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import com.facturacion.sistema_facturacion.repository.clienterepository;
import com.facturacion.sistema_facturacion.repository.usuariorepository;

@Component
public class pedidomapper {

    private final clienterepository clienteRepository;
    private final usuariorepository usuarioRepository;

    public pedidomapper(clienterepository clienteRepository, usuariorepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public pedidodto toDTO(pedidoentity e) {
        if (e == null) {
            return null;
        }
        pedidodto d = new pedidodto();
        d.setId_pedido(e.getId_pedido());
        d.setId_cliente(e.getCliente() != null ? e.getCliente().getId_cliente() : null);
        d.setId_usuario(e.getUsuario() != null ? e.getUsuario().getId_usuario() : null);
        d.setFecha(e.getFecha());
        d.setEstado(e.getEstado());
        d.setTotal(e.getTotal());
        d.setObservaciones(e.getObservaciones());
        return d;
    }

    public pedidoentity toEntity(pedidodto d) {
        if (d == null) {
            return null;
        }
        pedidoentity e = new pedidoentity();
        e.setId_pedido(d.getId_pedido());
        e.setCliente(resolver(d.getId_cliente(), clienteRepository, "Cliente"));
        e.setUsuario(resolver(d.getId_usuario(), usuarioRepository, "Usuario"));
        e.setFecha(d.getFecha());
        e.setEstado(d.getEstado());
        e.setTotal(d.getTotal());
        e.setObservaciones(d.getObservaciones());
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
