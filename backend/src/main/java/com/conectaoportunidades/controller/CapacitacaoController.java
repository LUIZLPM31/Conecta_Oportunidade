package com.conectaoportunidades.controller;

import com.conectaoportunidades.dto.CapacitacaoDTO;
import com.conectaoportunidades.service.CapacitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capacitacoes")
@RequiredArgsConstructor
public class CapacitacaoController {

    private final CapacitacaoService capacitacaoService;

    @GetMapping
    public ResponseEntity<List<CapacitacaoDTO.Response>> listarTodas() {
        return ResponseEntity.ok(capacitacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CapacitacaoDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(capacitacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CapacitacaoDTO.Response> criar(
            @Valid @RequestBody CapacitacaoDTO.Request dto) {
        return ResponseEntity.ok(capacitacaoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CapacitacaoDTO.Response> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CapacitacaoDTO.Request dto) {
        return ResponseEntity.ok(capacitacaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        capacitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
