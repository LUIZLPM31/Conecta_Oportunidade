package com.conectaoportunidades.service;

import com.conectaoportunidades.dto.CapacitacaoDTO;
import com.conectaoportunidades.model.Capacitacao;
import com.conectaoportunidades.repository.CapacitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CapacitacaoService {

    private final CapacitacaoRepository capacitacaoRepository;

    public List<CapacitacaoDTO.Response> listarTodas() {
        return capacitacaoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CapacitacaoDTO.Response buscarPorId(Long id) {
        return toResponse(findOrThrow(id));
    }

    public CapacitacaoDTO.Response criar(CapacitacaoDTO.Request dto) {
        Capacitacao c = Capacitacao.builder()
                .tituloCurso(dto.getTituloCurso())
                .descricao(dto.getDescricao())
                .cargaHoraria(dto.getCargaHoraria())
                .linkAcesso(dto.getLinkAcesso())
                .instituicaoParceira(dto.getInstituicaoParceira())
                .gratuito(dto.getGratuito() != null ? dto.getGratuito() : true)
                .build();

        return toResponse(capacitacaoRepository.save(c));
    }

    public CapacitacaoDTO.Response atualizar(Long id, CapacitacaoDTO.Request dto) {
        Capacitacao c = findOrThrow(id);

        c.setTituloCurso(dto.getTituloCurso());
        if (dto.getDescricao()           != null) c.setDescricao(dto.getDescricao());
        if (dto.getCargaHoraria()        != null) c.setCargaHoraria(dto.getCargaHoraria());
        if (dto.getLinkAcesso()          != null) c.setLinkAcesso(dto.getLinkAcesso());
        if (dto.getInstituicaoParceira() != null) c.setInstituicaoParceira(dto.getInstituicaoParceira());
        if (dto.getGratuito()            != null) c.setGratuito(dto.getGratuito());

        return toResponse(capacitacaoRepository.save(c));
    }

    public void deletar(Long id) {
        findOrThrow(id);
        capacitacaoRepository.deleteById(id);
    }

    private Capacitacao findOrThrow(Long id) {
        return capacitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Capacitação não encontrada: " + id));
    }

    private CapacitacaoDTO.Response toResponse(Capacitacao c) {
        CapacitacaoDTO.Response r = new CapacitacaoDTO.Response();
        r.setId(c.getId());
        r.setTituloCurso(c.getTituloCurso());
        r.setDescricao(c.getDescricao());
        r.setCargaHoraria(c.getCargaHoraria());
        r.setLinkAcesso(c.getLinkAcesso());
        r.setInstituicaoParceira(c.getInstituicaoParceira());
        r.setGratuito(c.getGratuito());
        r.setCriadoEm(c.getCriadoEm() != null ? c.getCriadoEm().toString() : null);
        return r;
    }
}
