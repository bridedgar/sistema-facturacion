package com.facturacion.sistema_facturacion.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facturacion.sistema_facturacion.model.entity.usuarioentity;
import com.facturacion.sistema_facturacion.repository.usuariorepository;

@Service
public class usuarioservice {

    private final usuariorepository usuarioRepository;

    public usuarioservice(usuariorepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public usuarioentity guardar(usuarioentity usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<usuarioentity> listar() {
        return usuarioRepository.findAll();
    }

    public usuarioentity buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public usuarioentity actualizar(Long id, usuarioentity usuario) {
        if (!usuarioRepository.existsById(id)) {
            return null;
        }

        usuario.setId_usuario(id);
        return usuarioRepository.save(usuario);
    }

    public boolean eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        usuarioRepository.deleteById(id);
        return true;
    }

    public usuarioentity autenticar(String correo, String contrasena) {
        return usuarioRepository.findByCorreoAndContrasena(correo, contrasena).orElse(null);
    }
}