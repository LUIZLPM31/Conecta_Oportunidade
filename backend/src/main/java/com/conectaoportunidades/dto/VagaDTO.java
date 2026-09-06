package com.conectaoportunidades.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import com.conectaoportunidades.model.Vaga;

public class VagaDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Título da vaga é obrigatório")
        private String tituloVaga;

        private String descricao;
        private BigDecimal salario;
        private String requisitos;

        @NotNull(message = "Modalidade é obrigatória")
        private Vaga.Modalidade modalidade;
    }

    @Data
    public static class Response {
        private Long id;
        private String tituloVaga;
        private String descricao;
        private BigDecimal salario;
        private String requisitos;
        private Vaga.Modalidade modalidade;
        private Vaga.StatusVaga status;
        private Long empresaId;
        private String nomeEmpresa;
        private String criadoEm;
    }
}
