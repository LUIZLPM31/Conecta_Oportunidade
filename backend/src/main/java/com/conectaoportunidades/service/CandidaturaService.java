package com.conectaoportunidades.service;

import com.conectaoportunidades.dto.CandidaturaDTO;
import com.conectaoportunidades.model.Candidatura;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.model.Vaga;
import com.conectaoportunidades.repository.CandidaturaRepository;
import com.conectaoportunidades.repository.UsuarioRepository;
import com.conectaoportunidades.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository candidaturaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VagaRepository vagaRepository;

    public CandidaturaDTO.Response candidatar(Long candidatoId, Long vagaId) {
        if (candidaturaRepository.existsByCandidatoIdAndVagaId(candidatoId, vagaId)) {
            throw new RuntimeException("Você já se candidatou a esta vaga.");
        }

        Usuario candidato = usuarioRepository.findById(candidatoId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado."));

        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada."));

        if (vaga.getStatus() == Vaga.StatusVaga.ENCERRADA) {
            throw new RuntimeException("Esta vaga está encerrada.");
        }

        Candidatura candidatura = Candidatura.builder()
                .candidato(candidato)
                .vaga(vaga)
                .build();

        return toResponse(candidaturaRepository.save(candidatura));
    }

    public List<CandidaturaDTO.Response> listarPorCandidato(Long candidatoId) {
        return candidaturaRepository.findByCandidatoId(candidatoId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CandidaturaDTO.Response> listarPorVaga(Long vagaId) {
        return candidaturaRepository.findByVagaId(vagaId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CandidaturaDTO.Response> listarTodas() {
        return candidaturaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CandidaturaDTO.Response atualizarStatus(Long id, Candidatura.StatusCandidatura novoStatus) {
        Candidatura c = candidaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada: " + id));
        c.setStatus(novoStatus);
        return toResponse(candidaturaRepository.save(c));
    }

    public void deletar(Long id) {
        candidaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada: " + id));
        candidaturaRepository.deleteById(id);
    }

    private CandidaturaDTO.Response toResponse(Candidatura c) {
        CandidaturaDTO.Response r = new CandidaturaDTO.Response();
        r.setId(c.getId());
        r.setCandidatoId(c.getCandidato().getId());
        r.setNomeCandidato(c.getCandidato().getNome());
        r.setEmailCandidato(c.getCandidato().getEmail());
        r.setVagaId(c.getVaga().getId());
        r.setTituloVaga(c.getVaga().getTituloVaga());
        r.setStatus(c.getStatus());
        r.setDataCandidatura(c.getDataCandidatura() != null ? c.getDataCandidatura().toString() : null);
        return r;
    }
}
