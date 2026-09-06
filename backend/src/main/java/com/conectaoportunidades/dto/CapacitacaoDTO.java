package com.conectaoportunidades.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CapacitacaoDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Título do curso é obrigatório")
        private String tituloCurso;

        private String descricao;
        private Integer cargaHoraria;
        private String linkAcesso;
        private String instituicaoParceira;
        private Boolean gratuito = true;
    }

    @Data
    public static class Response {
        private Long id;
        private String tituloCurso;
        private String descricao;
        private Integer cargaHoraria;
        private String linkAcesso;
        private String instituicaoParceira;
        private Boolean gratuito;
        private String criadoEm;
    }
}
