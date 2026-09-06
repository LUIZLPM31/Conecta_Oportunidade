package com.conectaoportunidades.controller;

import com.conectaoportunidades.dto.CandidaturaDTO;
import com.conectaoportunidades.model.Candidatura;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.service.CandidaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidaturas")
@RequiredArgsConstructor
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    @PostMapping("/vaga/{vagaId}")
    public ResponseEntity<CandidaturaDTO.Response> candidatar(
            @PathVariable Long vagaId,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(candidaturaService.candidatar(usuario.getId(), vagaId));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<CandidaturaDTO.Response>> minhasCandidaturas(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(candidaturaService.listarPorCandidato(usuario.getId()));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<CandidaturaDTO.Response>> listarTodas() {
        return ResponseEntity.ok(candidaturaService.listarTodas());
    }

    @GetMapping("/vaga/{vagaId}")
    public ResponseEntity<List<CandidaturaDTO.Response>> candidatosPorVaga(
            @PathVariable Long vagaId) {
        return ResponseEntity.ok(candidaturaService.listarPorVaga(vagaId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CandidaturaDTO.Response> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Candidatura.StatusCandidatura status) {
        return ResponseEntity.ok(candidaturaService.atualizarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        candidaturaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
