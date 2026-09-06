package com.conectaoportunidades.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "capacitacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Capacitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo_curso", nullable = false, length = 200)
    private String tituloCurso;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "carga_horaria")
    private Integer cargaHoraria;

    @Column(name = "link_acesso", length = 500)
    private String linkAcesso;

    @Column(name = "instituicao_parceira", length = 200)
    private String instituicaoParceira;

    @Column(nullable = false)
    @Builder.Default
    private Boolean gratuito = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
