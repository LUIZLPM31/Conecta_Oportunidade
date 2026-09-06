package com.conectaoportunidades.repository;

import com.conectaoportunidades.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Usuario> findByTipoUsuario(Usuario.TipoUsuario tipoUsuario);
}
