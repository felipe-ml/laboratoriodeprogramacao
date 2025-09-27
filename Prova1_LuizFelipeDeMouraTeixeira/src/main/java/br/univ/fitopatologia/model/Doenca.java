package br.univ.fitopatologia.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "doencas")
public class Doenca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "agente_causador", nullable = false, length = 150)
    private String agenteCausador;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_patogeno", nullable = false)
    private TipoPatogeno tipoPatogeno;

    @Column(name = "sintomas", length = 1000)
    private String sintomas;

    @Column(name = "controle", length = 500)
    private String controle;

    @Enumerated(EnumType.STRING)
    @Column(name = "severidade", nullable = false)
    private Severidade severidade;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Column(name = "regiao", length = 200)
    private String regiao;

    @Column(name = "temperatura_favoravel")
    private Double temperaturaFavoravel;

    @Column(name = "umidade_favoravel")
    private Double umidadeFavoravel;

    // Enums
    public enum TipoPatogeno {
        FUNGO("Fungo"),
        BACTERIA("Bactéria"),
        VIRUS("Vírus"),
        NEMATOIDE("Nematoide"),
        OOMICETO("Oomiceto");

        private String descricao;

        TipoPatogeno(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum Severidade {
        BAIXA("Baixa"),
        MEDIA("Média"),
        ALTA("Alta"),
        CRITICA("Crítica");

        private String descricao;

        Severidade(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // Construtores
    public Doenca() {
        this.dataRegistro = LocalDate.now();
    }

    public Doenca(String nome, String agenteCausador, TipoPatogeno tipoPatogeno, Severidade severidade) {
        this();
        this.nome = nome;
        this.agenteCausador = agenteCausador;
        this.tipoPatogeno = tipoPatogeno;
        this.severidade = severidade;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getAgenteCausador() {
        return agenteCausador;
    }

    public void setAgenteCausador(String agenteCausador) {
        this.agenteCausador = agenteCausador;
    }

    public TipoPatogeno getTipoPatogeno() {
        return tipoPatogeno;
    }

    public void setTipoPatogeno(TipoPatogeno tipoPatogeno) {
        this.tipoPatogeno = tipoPatogeno;
    }

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }

    public String getControle() {
        return controle;
    }

    public void setControle(String controle) {
        this.controle = controle;
    }

    public Severidade getSeveridade() {
        return severidade;
    }

    public void setSeveridade(Severidade severidade) {
        this.severidade = severidade;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDate dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public Double getTemperaturaFavoravel() {
        return temperaturaFavoravel;
    }

    public void setTemperaturaFavoravel(Double temperaturaFavoravel) {
        this.temperaturaFavoravel = temperaturaFavoravel;
    }

    public Double getUmidadeFavoravel() {
        return umidadeFavoravel;
    }

    public void setUmidadeFavoravel(Double umidadeFavoravel) {
        this.umidadeFavoravel = umidadeFavoravel;
    }

    @Override
    public String toString() {
        return "Doenca{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", agenteCausador='" + agenteCausador + '\'' +
                ", tipoPatogeno=" + tipoPatogeno +
                ", severidade=" + severidade +
                '}';
    }
}