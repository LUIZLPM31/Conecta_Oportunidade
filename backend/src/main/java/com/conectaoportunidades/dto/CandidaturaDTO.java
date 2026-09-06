package com.conectaoportunidades.dto;

import lombok.Data;
import com.conectaoportunidades.model.Candidatura;

public class CandidaturaDTO {

    @Data
    public static class Request {
        private Long vagaId;
    }

    @Data
    public static class StatusRequest {
        private Candidatura.StatusCandidatura status;
    }

    @Data
    public static class Response {
        private Long id;
        private Long candidatoId;
        private String nomeCandidato;
        private String emailCandidato;
        private Long vagaId;
        private String tituloVaga;
        private Candidatura.StatusCandidatura status;
        private String dataCandidatura;
    }
}
