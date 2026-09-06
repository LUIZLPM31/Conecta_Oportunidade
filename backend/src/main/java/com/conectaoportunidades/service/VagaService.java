package com.conectaoportunidades.service;

import com.conectaoportunidades.dto.VagaDTO;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.model.Vaga;
import com.conectaoportunidades.repository.UsuarioRepository;
import com.conectaoportunidades.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<VagaDTO.Response> listarTodas() {
        return vagaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<VagaDTO.Response> listarAtivas() {
        return vagaRepository.findByStatus(Vaga.StatusVaga.ATIVA).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<VagaDTO.Response> listarPorEmpresa(Long empresaId) {
        return vagaRepository.findByEmpresaId(empresaId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VagaDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    public VagaDTO.Response criar(VagaDTO.Request dto, Long empresaId) {
        Usuario empresa = usuarioRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada."));

        if (empresa.getTipoUsuario() != Usuario.TipoUsuario.EMPRESA &&
            empresa.getTipoUsuario() != Usuario.TipoUsuario.ADMIN) {
            throw new RuntimeException("Apenas empresas podem criar vagas.");
        }

        Vaga vaga = Vaga.builder()
                .tituloVaga(dto.getTituloVaga())
                .descricao(dto.getDescricao())
                .salario(dto.getSalario())
                .requisitos(dto.getRequisitos())
                .modalidade(dto.getModalidade())
                .empresa(empresa)
                .build();

        return toResponse(vagaRepository.save(vaga));
    }

    public VagaDTO.Response atualizar(Long id, VagaDTO.Request dto) {
        Vaga vaga = findOrThrow(id);

        vaga.setTituloVaga(dto.getTituloVaga());
        if (dto.getDescricao()  != null) vaga.setDescricao(dto.getDescricao());
        if (dto.getSalario()    != null) vaga.setSalario(dto.getSalario());
        if (dto.getRequisitos() != null) vaga.setRequisitos(dto.getRequisitos());
        if (dto.getModalidade() != null) vaga.setModalidade(dto.getModalidade());

        return toResponse(vagaRepository.save(vaga));
    }

    public void deletar(Long id) {
        findOrThrow(id);
        vagaRepository.deleteById(id);
    }

    public VagaDTO.Response alterarStatus(Long id, Vaga.StatusVaga novoStatus) {
        Vaga vaga = findOrThrow(id);
        vaga.setStatus(novoStatus);
        return toResponse(vagaRepository.save(vaga));
    }

    private Vaga findOrThrow(Long id) {
        return vagaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada: " + id));
    }

    public VagaDTO.Response toResponse(Vaga v) {
        VagaDTO.Response r = new VagaDTO.Response();
        r.setId(v.getId());
        r.setTituloVaga(v.getTituloVaga());
        r.setDescricao(v.getDescricao());
        r.setSalario(v.getSalario());
        r.setRequisitos(v.getRequisitos());
        r.setModalidade(v.getModalidade());
        r.setStatus(v.getStatus());
        r.setEmpresaId(v.getEmpresa().getId());
        r.setNomeEmpresa(v.getEmpresa().getNome());
        r.setCriadoEm(v.getCriadoEm() != null ? v.getCriadoEm().toString() : null);
        return r;
    }
}
