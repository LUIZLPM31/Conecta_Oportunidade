package com.conectaoportunidades.controller;

import com.conectaoportunidades.dto.AuthDTO;
import com.conectaoportunidades.dto.UsuarioDTO;
import com.conectaoportunidades.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<UsuarioDTO.Response> registro(@Valid @RequestBody UsuarioDTO.Request dto) {
        return ResponseEntity.ok(authService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.LoginResponse> login(@Valid @RequestBody AuthDTO.LoginRequest dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
