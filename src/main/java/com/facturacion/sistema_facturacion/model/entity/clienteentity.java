package com.facturacion.sistema_facturacion.model.entity;

import com.facturacion.sistema_facturacion.enums.tipocliente;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor 
@Setter
@Getter
@Entity
public class clienteentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;

    private String nombre;
    private String documento;
    private String telefono;
    private String correo;
    private String direccion;
    private String ciudad;
    @Enumerated(EnumType.STRING)
    private tipocliente tipo_cliente;
}
