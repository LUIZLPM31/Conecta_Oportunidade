package com.conectaoportunidades.dto;

import com.conectaoportunidades.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class UsuarioDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 150)
        private String nome;

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido")
        private String email;

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter ao menos 6 caracteres")
        private String senha;

        @NotNull(message = "Tipo de usuário é obrigatório")
        private Usuario.TipoUsuario tipoUsuario;

        private String telefone;
        private String cidade;
    }

    @Data
    public static class UpdateRequest {
        @Size(max = 150)
        private String nome;

        private String telefone;
        private String cidade;
    }

    @Data
    public static class Response {
        private Long id;
        private String nome;
        private String email;
        private Usuario.TipoUsuario tipoUsuario;
        private String telefone;
        private String cidade;
        private String criadoEm;
    }
}
