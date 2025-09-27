CREATE DATABASE IF NOT EXISTS fitopatologia_soja
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;


USE fitopatologia_soja;


CREATE TABLE doencas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    agente_causador VARCHAR(150) NOT NULL,
    tipo_patogeno ENUM('FUNGO', 'BACTERIA', 'VIRUS', 'NEMATOIDE', 'OOMICETO') NOT NULL,
    severidade ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL,
    sintomas TEXT,
    controle VARCHAR(500),
    regiao VARCHAR(200),
    temperatura_favoravel DECIMAL(5,2),
    umidade_favoravel DECIMAL(5,2),
    data_registro DATE NOT NULL,

    PRIMARY KEY (id),
    INDEX idx_nome (nome),
    INDEX idx_agente_causador (agente_causador),
    INDEX idx_tipo_patogeno (tipo_patogeno),
    INDEX idx_severidade (severidade),
    INDEX idx_regiao (regiao),
    INDEX idx_data_registro (data_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO doencas (
    nome,
    agente_causador,
    tipo_patogeno,
    severidade,
    sintomas,
    controle,
    regiao,
    temperatura_favoravel,
    umidade_favoravel,
    data_registro
) VALUES
(
    'Ferrugem Asiática',
    'Phakopsora pachyrhizi',
    'FUNGO',
    'ALTA',
    'Pústulas alaranjadas na face inferior das folhas, progredindo para marrom-escuras. Desfolha precoce severa, reduzindo drasticamente a produtividade. As lesões começam pequenas e circulares, evoluindo para manchas irregulares.',
    'Aplicação preventiva de fungicidas sistêmicos (triazóis, estrobilurinas). Rotação de culturas com gramíneas. Plantio de cultivares com genes de resistência. Monitoramento constante durante a safra.',
    'Cerrado',
    25.0,
    80.0,
    CURDATE()
),
(
    'Mancha Olho-de-Rã',
    'Cercospora sojina',
    'FUNGO',
    'MEDIA',
    'Manchas circulares de 2-10mm com centro cinza-claro e halo amarelo característico. Nas vagens, manchas escuras e alongadas. Em condições favoráveis, causa desfolha significativa.',
    'Tratamento de sementes com fungicidas. Rotação de culturas por 2-3 anos. Aplicação foliar preventiva em condições climáticas favoráveis. Uso de cultivares resistentes quando disponíveis.',
    'Sul',
    22.0,
    85.0,
    CURDATE()
),
(
    'Cancro da Haste',
    'Diaporthe phaseolorum',
    'FUNGO',
    'ALTA',
    'Lesões alongadas e deprimidas na haste, inicialmente avermelhadas, tornando-se marrons. Murcha e morte súbita de plantas. Pontuações negras (picnídios) visíveis na lesão.',
    'Rotação de culturas com gramíneas por 2-3 anos. Plantio de cultivares resistentes. Tratamento de sementes. Evitar plantios muito adensados e irrigação excessiva.',
    'Nordeste',
    28.0,
    75.0,
    CURDATE()
),
(
    'Podridão Branca da Haste',
    'Sclerotinia sclerotiorum',
    'FUNGO',
    'CRITICA',
    'Micélio branco algodonoso na haste e vagens. Formação de escleródios pretos no interior dos tecidos. Murcha repentina e morte de plantas. Podridão aquosa dos tecidos.',
    'Controle biológico com Trichoderma spp. Aplicação de fungicidas (procimidona, iprodiona). Rotação com gramíneas. Manejo adequado da irrigação e densidade de plantio.',
    'Sul',
    18.0,
    90.0,
    CURDATE()
),
(
    'Mosaico Comum da Soja',
    'Soybean mosaic virus',
    'VIRUS',
    'MEDIA',
    'Mosaico foliar com áreas verde-claras e escuras alternadas. Deformação e enrugamento das folhas. Redução do crescimento da planta. Sintomas mais evidentes em folhas jovens.',
    'Controle rigoroso de afídeos vetores com inseticidas sistêmicos. Uso de sementes sadias certificadas. Eliminação de plantas daninhas hospedeiras. Plantio de cultivares resistentes.',
    'Centro-Oeste',
    26.0,
    70.0,
    CURDATE()
),
(
    'Antracnose',
    'Colletotrichum truncatum',
    'FUNGO',
    'ALTA',
    'Manchas necróticas irregulares nas folhas, hastes e vagens. Necrose das nervuras foliares. Nas vagens, manchas escuras circulares a alongadas. Pode causar tombamento de plântulas.',
    'Tratamento de sementes com fungicidas sistêmicos. Rotação de culturas. Aplicação foliar preventiva. Uso de sementes sadias. Manejo adequado da irrigação.',
    'Centro-Oeste',
    27.0,
    85.0,
    CURDATE()
),
(
    'Oídio',
    'Microsphaera diffusa',
    'FUNGO',
    'BAIXA',
    'Crescimento pulverulento branco na superfície das folhas, principalmente na face superior. Amarelecimento e queda prematura das folhas afetadas. Sintomas iniciam nas folhas mais velhas.',
    'Aplicação de fungicidas específicos (enxofre, tebuconazol). Plantio em locais com boa ventilação. Evitar excesso de nitrogênio. Uso de cultivares menos suscetíveis.',
    'Sudeste',
    24.0,
    60.0,
    CURDATE()
),
(
    'Nematoide de Cisto',
    'Heterodera glycines',
    'NEMATOIDE',
    'CRITICA',
    'Amarelecimento e nanismo das plantas. Clorose internerval. Formação de cistos brancos a marrons nas raízes. Redução significativa do sistema radicular e produtividade.',
    'Rotação com culturas não hospedeiras (milho, algodão). Plantio de cultivares resistentes. Uso de nematicidas em casos severos. Manejo integrado com adubação balanceada.',
    'Cerrado',
    28.0,
    65.0,
    CURDATE()
);

SELECT
    id,
    nome,
    agente_causador,
    tipo_patogeno,
    severidade,
    regiao,
    data_registro
FROM doencas
ORDER BY severidade DESC, nome;

SELECT
    'Total de doenças' as categoria,
    COUNT(*) as quantidade
FROM doencas

UNION ALL

SELECT
    CONCAT('Severidade: ', severidade) as categoria,
    COUNT(*) as quantidade
FROM doencas
GROUP BY severidade

UNION ALL

SELECT
    CONCAT('Tipo: ', tipo_patogeno) as categoria,
    COUNT(*) as quantidade
FROM doencas
GROUP BY tipo_patogeno

ORDER BY categoria;

SELECT nome, agente_causador, severidade
FROM doencas
WHERE severidade IN ('CRITICA', 'ALTA')
ORDER BY severidade DESC;

SELECT nome, agente_causador, regiao
FROM doencas
WHERE tipo_patogeno = 'FUNGO'
ORDER BY nome;

SELECT nome, agente_causador, tipo_patogeno, severidade
FROM doencas
WHERE regiao = 'Cerrado'
ORDER BY severidade DESC;

SELECT nome, temperatura_favoravel, umidade_favoravel, regiao
FROM doencas
WHERE temperatura_favoravel BETWEEN 25 AND 30
AND umidade_favoravel >= 80
ORDER BY temperatura_favoravel;