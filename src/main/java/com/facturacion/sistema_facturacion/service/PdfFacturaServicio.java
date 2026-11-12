package com.facturacion.sistema_facturacion.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.detallepeentity;
import com.facturacion.sistema_facturacion.model.entity.pedidoentity;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfFacturaServicio {

    public byte[] generarPdf(pedidoentity pedido, List<detallepeentity> detalles) {

        try {
            ByteArrayOutputStream salida = new ByteArrayOutputStream();

            Document documento = new Document();
            PdfWriter.getInstance(documento, salida);

            documento.open();

            // Título
            Paragraph titulo = new Paragraph("COMPROBANTE DE PEDIDO");
            documento.add(titulo);

            documento.add(new Paragraph(" "));

            // Información del pedido
            documento.add(new Paragraph(
                    "Pedido N°: " + pedido.getId_pedido()
            ));

            if (pedido.getFecha() != null) {
                documento.add(new Paragraph(
                        "Fecha: " + pedido.getFecha()
                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                ));
            }

            if (pedido.getCliente() != null) {
                documento.add(new Paragraph(
                        "Cliente: " + pedido.getCliente().getNombre()
                ));

                documento.add(new Paragraph(
                        "Documento: " + pedido.getCliente().getDocumento()
                ));

                documento.add(new Paragraph(
                        "Correo: " + pedido.getCliente().getCorreo()
                ));
            }

            documento.add(new Paragraph(
                    "Estado: " + pedido.getEstado()
            ));

            documento.add(new Paragraph(" "));

            // Tabla de productos
            Table tabla = new Table(4);

            tabla.addCell(new Phrase("Producto"));
            tabla.addCell(new Phrase("Cantidad"));
            tabla.addCell(new Phrase("Precio"));
            tabla.addCell(new Phrase("Subtotal"));

            for (detallepeentity detalle : detalles) {

                String nombreProducto = "Producto";

                if (detalle.getProducto() != null) {
                    nombreProducto = detalle.getProducto().getNombre();
                }

                double precio = detalle.getPrecio() != null
                        ? detalle.getPrecio()
                        : 0.0;

                int cantidad = detalle.getCantidad() != null
                        ? detalle.getCantidad()
                        : 0;

                double subtotal = precio * cantidad;

                tabla.addCell(new Phrase(nombreProducto));
                tabla.addCell(new Phrase(String.valueOf(cantidad)));
                tabla.addCell(new Phrase(String.format("%.2f", precio)));
                tabla.addCell(new Phrase(String.format("%.2f", subtotal)));
            }

            documento.add(tabla);

            documento.add(new Paragraph(" "));

            // Total
            double total = pedido.getTotal() != null
                    ? pedido.getTotal()
                    : 0.0;

            documento.add(new Paragraph(
                    "TOTAL: $" + String.format("%.2f", total)
            ));

            // Observaciones
            if (pedido.getObservaciones() != null
                    && !pedido.getObservaciones().isBlank()) {

                documento.add(new Paragraph(" "));
                documento.add(new Paragraph(
                        "Observaciones: " + pedido.getObservaciones()
                ));
            }

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph(
                    "Gracias por su compra."
            ));

            documento.close();

            return salida.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error al generar el PDF del pedido", e
            );
        }
    }
}