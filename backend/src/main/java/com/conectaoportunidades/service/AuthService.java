package com.conectaoportunidades.service;

import com.conectaoportunidades.dto.AuthDTO;
import com.conectaoportunidades.dto.UsuarioDTO;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.repository.UsuarioRepository;
import com.conectaoportunidades.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UsuarioDTO.Response registrar(UsuarioDTO.Request dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .tipoUsuario(dto.getTipoUsuario())
                .telefone(dto.getTelefone())
                .cidade(dto.getCidade())
                .build();

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas."));

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas.");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getTipoUsuario().name());

        return new AuthDTO.LoginResponse(
                token,
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario().name()
        );
    }

    private UsuarioDTO.Response toResponse(Usuario u) {
        UsuarioDTO.Response r = new UsuarioDTO.Response();
        r.setId(u.getId());
        r.setNome(u.getNome());
        r.setEmail(u.getEmail());
        r.setTipoUsuario(u.getTipoUsuario());
        r.setTelefone(u.getTelefone());
        r.setCidade(u.getCidade());
        r.setCriadoEm(u.getCriadoEm() != null ? u.getCriadoEm().toString() : null);
        return r;
    }
}
