package com.conectaoportunidades.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "candidaturas",
    uniqueConstraints = @UniqueConstraint(columnNames = {"candidato_id", "vaga_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id", nullable = false)
    private Usuario candidato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vaga_id", nullable = false)
    private Vaga vaga;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private StatusCandidatura status = StatusCandidatura.PENDENTE;

    @Column(name = "data_candidatura", nullable = false, updatable = false)
    private LocalDateTime dataCandidatura;

    @PrePersist
    public void prePersist() {
        this.dataCandidatura = LocalDateTime.now();
    }

    public enum StatusCandidatura {
        PENDENTE, APROVADO, REJEITADO
    }
}
