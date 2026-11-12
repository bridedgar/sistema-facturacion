package com.facturacion.sistema_facturacion.model.entity;

import com.facturacion.sistema_facturacion.enums.Estadopago;
import com.facturacion.sistema_facturacion.enums.metodopago;

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
public class pagoentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pago;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private pedidoentity pedido;

    private Double monto;

    @Enumerated(EnumType.STRING)
    private metodopago metodo;

    @Enumerated(EnumType.STRING)
    private Estadopago estado;

    private LocalDate fecha;
}