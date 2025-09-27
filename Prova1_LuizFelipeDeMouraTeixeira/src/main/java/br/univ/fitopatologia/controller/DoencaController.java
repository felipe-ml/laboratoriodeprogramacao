package br.univ.fitopatologia.service;

import br.univ.fitopatologia.model.Doenca;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/doencas")
public class DoencaController {

    @Autowired
    private DoencaService doencaService;

    @GetMapping
    public String listar(Model model) {
        List<Doenca> doencas = doencaService.findAll();
        model.addAttribute("doencas", doencas);
        model.addAttribute("totalDoencas", doencas.size());
        return "index";
    }

    @GetMapping("/nova")
    public String novaDoenca(Model model) {
        model.addAttribute("doenca", new Doenca());
        model.addAttribute("tiposPatogeno", Doenca.TipoPatogeno.values());
        model.addAttribute("severidade", Doenca.Severidade.values());
        model.addAttribute("titulo", "Nova Doença");
        model.addAttribute("acao", "Cadastrar");
        return "form";
    }

    @PostMapping("/salvar")
    public String salvar(@ModelAttribute("doenca") Doenca doenca,
                         BindingResult bindingResult,
                         RedirectAttributes redirectAttributes,
                         Model model) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("tiposPatogeno", Doenca.TipoPatogeno.values());
            model.addAttribute("severidade", Doenca.Severidade.values());
            model.addAttribute("titulo", doenca.getId() == null ? "Nova Doença" : "Editar Doença");
            model.addAttribute("acao", doenca.getId() == null ? "Cadastrar" : "Atualizar");
            return "form";
        }

        try {
            doencaService.save(doenca);
            String mensagem = doenca.getId() == null ?
                    "Tabela cadastrada com sucesso!" :
                    "Tabela atualizada com sucesso!";
            redirectAttributes.addFlashAttribute("mensagemSucesso", mensagem);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro",
                    "Erro ao salvar doença: " + e.getMessage());
        }

        return "redirect:/doencas";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Doenca> doenca = doencaService.findById(id);

        if (doenca.isPresent()) {
            model.addAttribute("doenca", doenca.get());
            model.addAttribute("tiposPatogeno", Doenca.TipoPatogeno.values());
            model.addAttribute("severidade", Doenca.Severidade.values());
            model.addAttribute("titulo", "Editar Doença");
            model.addAttribute("acao", "Atualizar");
            return "form";
        } else {
            redirectAttributes.addFlashAttribute("mensagemErro", "Doença não encontrada!");
            return "redirect:/doencas";
        }
    }

    @GetMapping("/excluir/{id}")
    public String excluir(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            if (doencaService.existsById(id)) {
                doencaService.deleteById(id);
                redirectAttributes.addFlashAttribute("mensagemSucesso", "Doença excluída com sucesso!");
            } else {
                redirectAttributes.addFlashAttribute("mensagemErro", "Doença não encontrada!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro",
                    "Erro ao excluir doença: " + e.getMessage());
        }

        return "redirect:/doencas";
    }

    @GetMapping("/pesquisar")
    public String pesquisar(Model model) {
        model.addAttribute("tiposPatogeno", Doenca.TipoPatogeno.values());
        model.addAttribute("severidade", Doenca.Severidade.values());
        return "search";
    }

    @PostMapping("/pesquisar")
    public String realizarPesquisa(@RequestParam(required = false) String criterio,
                                   @RequestParam(required = false) String termo,
                                   @RequestParam(required = false) String tipoPatogeno,
                                   @RequestParam(required = false) String severidade,
                                   Model model) {

        List<Doenca> resultados;

        if (criterio != null && termo != null && !termo.trim().isEmpty()) {
            switch (criterio) {
                case "nome":
                    resultados = doencaService.findByNome(termo);
                    break;
                case "agenteCausador":
                    resultados = doencaService.findByAgenteCausador(termo);
                    break;
                case "regiao":
                    resultados = doencaService.findByRegiao(termo);
                    break;
                default:
                    resultados = doencaService.findAll();
                    break;
            }
        } else {
            // Pesquisa por múltiplos critérios
            Doenca.TipoPatogeno tipo = (tipoPatogeno != null && !tipoPatogeno.isEmpty()) ?
                    Doenca.TipoPatogeno.valueOf(tipoPatogeno) : null;
            Doenca.Severidade sev = (severidade != null && !severidade.isEmpty()) ?
                    Doenca.Severidade.valueOf(severidade) : null;

            resultados = doencaService.pesquisarPorMultiplosCriterios(null, null, tipo, sev);
        }

        model.addAttribute("resultados", resultados);
        model.addAttribute("totalResultados", resultados.size());
        model.addAttribute("tiposPatogeno", Doenca.TipoPatogeno.values());
        model.addAttribute("severidade", Doenca.Severidade.values());

        if (resultados.isEmpty()) {
            model.addAttribute("mensagemInfo", "Nenhuma doença encontrada com os critérios informados.");
        }

        return "search";
    }

    @GetMapping("/detalhes/{id}")
    public String detalhes(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Doenca> doenca = doencaService.findById(id);

        if (doenca.isPresent()) {
            model.addAttribute("doenca", doenca.get());
            return "detalhes";
        } else {
            redirectAttributes.addFlashAttribute("mensagemErro", "Doença não encontrada!");
            return "redirect:/doencas";
        }
    }
}