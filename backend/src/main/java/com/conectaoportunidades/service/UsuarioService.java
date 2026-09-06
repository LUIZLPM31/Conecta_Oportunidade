package com.conectaoportunidades.service;

import com.conectaoportunidades.dto.UsuarioDTO;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioDTO.Response> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    public UsuarioDTO.Response atualizar(Long id, UsuarioDTO.UpdateRequest dto) {
        Usuario usuario = findOrThrow(id);

        if (dto.getNome() != null)     usuario.setNome(dto.getNome());
        if (dto.getTelefone() != null) usuario.setTelefone(dto.getTelefone());
        if (dto.getCidade() != null)   usuario.setCidade(dto.getCidade());

        return toResponse(usuarioRepository.save(usuario));
    }

    public void deletar(Long id) {
        findOrThrow(id);
        usuarioRepository.deleteById(id);
    }

    private Usuario findOrThrow(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));
    }

    public UsuarioDTO.Response toResponse(Usuario u) {
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
