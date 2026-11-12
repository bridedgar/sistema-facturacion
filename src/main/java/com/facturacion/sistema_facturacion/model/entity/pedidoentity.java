package com.facturacion.sistema_facturacion.model.entity;

import com.facturacion.sistema_facturacion.enums.Estadopedido;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class pedidoentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pedido;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private clienteentity cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuarioentity usuario;

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private Estadopedido estado;

    private Double total;

    private String observaciones;
}