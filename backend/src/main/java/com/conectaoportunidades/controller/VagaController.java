package com.conectaoportunidades.controller;

import com.conectaoportunidades.dto.VagaDTO;
import com.conectaoportunidades.model.Usuario;
import com.conectaoportunidades.model.Vaga;
import com.conectaoportunidades.service.VagaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@RequiredArgsConstructor
public class VagaController {

    private final VagaService vagaService;

    // Público — lista vagas ativas
    @GetMapping
    public ResponseEntity<List<VagaDTO.Response>> listarAtivas() {
        return ResponseEntity.ok(vagaService.listarAtivas());
    }

    // Admin — todas as vagas
    @GetMapping("/todas")
    public ResponseEntity<List<VagaDTO.Response>> listarTodas() {
        return ResponseEntity.ok(vagaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VagaDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vagaService.buscarPorId(id));
    }

    // Vagas da empresa autenticada
    @GetMapping("/minhas")
    public ResponseEntity<List<VagaDTO.Response>> minhasVagas(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(vagaService.listarPorEmpresa(usuario.getId()));
    }

    @PostMapping
    public ResponseEntity<VagaDTO.Response> criar(
            @Valid @RequestBody VagaDTO.Request dto,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(vagaService.criar(dto, usuario.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VagaDTO.Response> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody VagaDTO.Request dto) {
        return ResponseEntity.ok(vagaService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VagaDTO.Response> alterarStatus(
            @PathVariable Long id,
            @RequestParam Vaga.StatusVaga status) {
        return ResponseEntity.ok(vagaService.alterarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        vagaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
