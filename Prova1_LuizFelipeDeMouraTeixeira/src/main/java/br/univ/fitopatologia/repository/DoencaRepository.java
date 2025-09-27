package br.univ.fitopatologia.repository;

import br.univ.fitopatologia.model.Doenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoencaRepository extends JpaRepository<Doenca, Long> {

    // Busca por nome (case-insensitive)
    List<Doenca> findByNomeContainingIgnoreCase(String nome);

    // Busca por agente causador
    List<Doenca> findByAgenteCausadorContainingIgnoreCase(String agenteCausador);

    // Busca por tipo de patógeno
    List<Doenca> findByTipoPatogeno(Doenca.TipoPatogeno tipoPatogeno);

    // Busca por severidade
    List<Doenca> findBySeveridade(Doenca.Severidade severidade);

    // Busca por região
    List<Doenca> findByRegiaoContainingIgnoreCase(String regiao);

    // Busca personalizada por múltiplos critérios
    @Query("SELECT d FROM Doenca d WHERE " +
            "(:nome IS NULL OR LOWER(d.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:agenteCausador IS NULL OR LOWER(d.agenteCausador) LIKE LOWER(CONCAT('%', :agenteCausador, '%'))) AND " +
            "(:tipoPatogeno IS NULL OR d.tipoPatogeno = :tipoPatogeno) AND " +
            "(:severidade IS NULL OR d.severidade = :severidade)")
    List<Doenca> findByMultiplosCriterios(@Param("nome") String nome,
                                          @Param("agenteCausador") String agenteCausador,
                                          @Param("tipoPatogeno") Doenca.TipoPatogeno tipoPatogeno,
                                          @Param("severidade") Doenca.Severidade severidade);
}