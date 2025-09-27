package br.univ.fitopatologia.service;

import br.univ.fitopatologia.model.Doenca;
import br.univ.fitopatologia.repository.DoencaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoencaService {

    @Autowired
    private DoencaRepository doencaRepository;

    public List<Doenca> findAll() {
        return doencaRepository.findAll();
    }

    public Optional<Doenca> findById(Long id) {
        return doencaRepository.findById(id);
    }

    public Doenca save(Doenca doenca) {
        return doencaRepository.save(doenca);
    }

    public void deleteById(Long id) {
        doencaRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return doencaRepository.existsById(id);
    }

    public List<Doenca> findByNome(String nome) {
        return doencaRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Doenca> findByAgenteCausador(String agenteCausador) {
        return doencaRepository.findByAgenteCausadorContainingIgnoreCase(agenteCausador);
    }

    public List<Doenca> findByTipoPatogeno(Doenca.TipoPatogeno tipoPatogeno) {
        return doencaRepository.findByTipoPatogeno(tipoPatogeno);
    }

    public List<Doenca> findBySeveridade(Doenca.Severidade severidade) {
        return doencaRepository.findBySeveridade(severidade);
    }

    public List<Doenca> findByRegiao(String regiao) {
        return doencaRepository.findByRegiaoContainingIgnoreCase(regiao);
    }

    public List<Doenca> pesquisarPorMultiplosCriterios(String nome, String agenteCausador,
                                                       Doenca.TipoPatogeno tipoPatogeno,
                                                       Doenca.Severidade severidade) {
        return doencaRepository.findByMultiplosCriterios(nome, agenteCausador, tipoPatogeno, severidade);
    }
}