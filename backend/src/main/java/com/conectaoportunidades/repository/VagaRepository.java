package com.conectaoportunidades.repository;

import com.conectaoportunidades.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VagaRepository extends JpaRepository<Vaga, Long> {
    List<Vaga> findByStatus(Vaga.StatusVaga status);
    List<Vaga> findByEmpresaId(Long empresaId);
    List<Vaga> findByModalidade(Vaga.Modalidade modalidade);
}
