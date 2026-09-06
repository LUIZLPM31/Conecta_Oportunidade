package com.conectaoportunidades.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "E-mail é obrigatório")
        @Email
        private String email;

        @NotBlank(message = "Senha é obrigatória")
        private String senha;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private Long id;
        private String nome;
        private String email;
        private String tipoUsuario;

        public LoginResponse(String token, Long id, String nome, String email, String tipoUsuario) {
            this.token = token;
            this.id = id;
            this.nome = nome;
            this.email = email;
            this.tipoUsuario = tipoUsuario;
        }
    }
}
