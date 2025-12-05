import React, { useState } from 'react';
import {
    ScrollView,
    FlatList,
    View,
    Alert,
    StyleSheet,
} from 'react-native';
import {
    Appbar,
    Card,
    TextInput,
    Button,
    Title,
    Paragraph,
    Chip,
    RadioButton,
    Text,
    HelperText,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';
import { doencaService, tiposPatogeno, severidades } from '../services/api';

const PesquisarDoencasScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    const [filtros, setFiltros] = useState({
        criterio: 'nome',
        termo: '',
        tipoPatogeno: '',
        severidade: '',
    });

    const handlePesquisar = async () => {
        console.log('🔎 handlePesquisar called with filtros:', filtros);

        if (!filtros.termo.trim() && !filtros.tipoPatogeno && !filtros.severidade) {
            Alert.alert('Aviso', 'Preencha pelo menos um critério de pesquisa');
            return;
        }

        setLoading(true);
        try {
            const response = await doencaService.pesquisar(filtros);
            console.log('🔎 API response for pesquisar:', response.data);
            if (response.data.success) {
                setResultados(response.data.data);
                setMostrarResultados(true);

                // Give quick feedback with count
                const count = response.data.total ?? response.data.data?.length ?? 0;
                Alert.alert('Pesquisa', `${count} resultado(s) encontrado(s)`);
            } else {
                Alert.alert('Pesquisa', 'Nenhum resultado encontrado');
            }
        } catch (error) {
            console.error('❌ Erro na pesquisa:', error);
            Alert.alert('Erro', 'Não foi possível realizar a pesquisa: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLimpar = () => {
        setFiltros({
            criterio: 'nome',
            termo: '',
            tipoPatogeno: '',
            severidade: '',
        });
        setResultados([]);
        setMostrarResultados(false);
    };

    const atualizarFiltro = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const getSeveridadeColor = (severidade) => {
        switch (severidade) {
            case 'CRITICA': return '#dc3545';
            case 'ALTA': return '#ff6b35';
            case 'MEDIA': return '#ffa726';
            default: return '#4caf50';
        }
    };

    const getSeveridadeText = (severidade) => {
        switch (severidade) {
            case 'CRITICA': return 'Crítica';
            case 'ALTA': return 'Alta';
            case 'MEDIA': return 'Média';
            default: return 'Baixa';
        }
    };

    const getTipoPatogenoIcon = (tipo) => {
        switch (tipo) {
            case 'FUNGO': return '🍄';
            case 'BACTERIA': return '🦠';
            case 'VIRUS': return '🦠';
            case 'NEMATOIDE': return '🐛';
            case 'OOMICETO': return '🌱';
            default: return '🔬';
        }
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card} elevation={2}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.doencaNome}>{item.nome}</Text>
                        <Text style={styles.icon}>
                            {getTipoPatogenoIcon(item.tipo_patogeno)}
                        </Text>
                    </View>

                    <Paragraph style={styles.agenteCausador}>
                        {item.agente_causador}
                    </Paragraph>
                </View>

                <View style={styles.chipsContainer}>
                    <Chip
                        mode="outlined"
                        style={styles.tipoChip}
                        textStyle={styles.tipoChipText}
                    >
                        {item.tipo_patogeno?.replace('_', ' ') || 'N/A'}
                    </Chip>

                    <Chip
                        mode="flat"
                        style={[
                            styles.severidadeChip,
                            { backgroundColor: getSeveridadeColor(item.severidade) }
                        ]}
                        textStyle={styles.severidadeChipText}
                    >
                        {getSeveridadeText(item.severidade)}
                    </Chip>
                </View>

                {item.regiao && (
                    <View style={styles.regiaoContainer}>
                        <Text style={styles.regiaoLabel}>🌍 Região: </Text>
                        <Text style={styles.regiaoText}>{item.regiao}</Text>
                    </View>
                )}

                <View style={styles.dataContainer}>
                    <Text style={styles.dataText}>
                        📅 Registrado em: {new Date(item.data_registro).toLocaleDateString('pt-BR')}
                    </Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.actions}>
                <Button
                    mode="outlined"
                    compact
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonText}
                    onPress={() => navigation.navigate('DetalhesDoenca', { doencaId: item.id })}
                    icon="eye"
                >
                    Ver Detalhes
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.headerAppbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Pesquisar Doenças"
                    titleStyle={styles.headerTitle}
                />
            </Appbar.Header>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* FILTROS DE PESQUISA */}
                <Card style={styles.card} elevation={3}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>🔍</Text>
                            <Title style={styles.sectionTitle}>Critérios de Pesquisa</Title>
                        </View>

                        <Text style={styles.radioGroupTitle}>Pesquisar por:</Text>
                        <RadioButton.Group
                            onValueChange={(value) => atualizarFiltro('criterio', value)}
                            value={filtros.criterio}
                        >
                            <View style={styles.radioContainer}>
                                <RadioButton.Item
                                    label="Nome da Doença"
                                    value="nome"
                                    style={styles.radioItem}
                                    labelStyle={styles.radioLabel}
                                    position="leading"
                                    color="#000"
                                />
                                <RadioButton.Item
                                    label="Agente Causador"
                                    value="agenteCausador"
                                    style={styles.radioItem}
                                    labelStyle={styles.radioLabel}
                                    position="leading"
                                    color="#000"
                                />
                                <RadioButton.Item
                                    label="Região"
                                    value="regiao"
                                    style={styles.radioItem}
                                    labelStyle={styles.radioLabel}
                                    position="leading"
                                    color="#000"
                                />
                            </View>
                        </RadioButton.Group>

                        <TextInput
                            label="Termo de Busca"
                            value={filtros.termo}
                            onChangeText={(text) => atualizarFiltro('termo', text)}
                            mode="outlined"
                            style={styles.textInput}
                            contentStyle={{ paddingVertical: 12, fontSize: 16, color: '#000' }}
                            labelStyle={{ color: '#777' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                            placeholder="Digite o termo para busca..."
                        />

                        <Divider style={styles.divider} />

                        <Text style={styles.radioGroupTitle}>Tipo de Patógeno:</Text>
                        <RadioButton.Group
                            onValueChange={(value) => atualizarFiltro('tipoPatogeno', value)}
                            value={filtros.tipoPatogeno}
                        >
                            <View style={styles.radioContainer}>
                                <RadioButton.Item
                                    label="Todos os tipos"
                                    value=""
                                    style={styles.radioItem}
                                    labelStyle={styles.radioLabel}
                                    position="leading"
                                    color="#000"
                                />
                                {tiposPatogeno.map((tipo) => (
                                    <RadioButton.Item
                                        key={tipo.value}
                                        label={tipo.label}
                                        value={tipo.value}
                                        style={styles.radioItem}
                                        labelStyle={styles.radioLabel}
                                        position="leading"
                                        color="#000"
                                    />
                                ))}
                            </View>
                        </RadioButton.Group>

                        <Divider style={styles.divider} />

                        <Text style={styles.radioGroupTitle}>Severidade:</Text>
                        <RadioButton.Group
                            onValueChange={(value) => atualizarFiltro('severidade', value)}
                            value={filtros.severidade}
                        >
                            <View style={styles.radioContainer}>
                                <RadioButton.Item
                                    label="Todas as severidades"
                                    value=""
                                    style={styles.radioItem}
                                    labelStyle={styles.radioLabel}
                                    position="leading"
                                    color="#000"
                                />
                                {severidades.map((sev) => (
                                    <RadioButton.Item
                                        key={sev.value}
                                        label={sev.label}
                                        value={sev.value}
                                        style={styles.radioItem}
                                        labelStyle={styles.radioLabel}
                                        position="leading"
                                        color="#000"
                                    />
                                ))}
                            </View>
                        </RadioButton.Group>

                        {/* BOTÕES DE AÇÃO */}
                        <View style={styles.actionsContainer}>
                            <Button
                                mode="contained"
                                onPress={handlePesquisar}
                                loading={loading}
                                disabled={loading}
                                style={styles.searchButton}
                                labelStyle={styles.searchButtonText}
                                icon={() => <Text style={styles.buttonIcon}>🔎</Text>}
                            >
                                Pesquisar
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={handleLimpar}
                                style={styles.clearButton}
                                labelStyle={styles.clearButtonText}
                                icon={() => <Text style={styles.buttonIcon}>🧹</Text>}
                            >
                                Limpar
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                {/* RESULTADOS */}
                {mostrarResultados && (
                    <Card style={styles.card} elevation={3}>
                        <Card.Content>
                            <View style={styles.resultsHeader}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionIcon}>📊</Text>
                                    <Title style={styles.sectionTitle}>Resultados da Pesquisa</Title>
                                </View>
                                <Chip mode="flat" style={styles.resultsCountChip}>
                                    {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
                                </Chip>
                            </View>

                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#4caf50" />
                                    <Text style={styles.loadingText}>Buscando doenças...</Text>
                                </View>
                            ) : resultados.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyIcon}>🔍</Text>
                                    <Text style={styles.emptyTitle}>Nenhuma doença encontrada</Text>
                                    <Text style={styles.emptyText}>
                                        Tente ajustar os critérios de pesquisa
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={resultados}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.listContent}
                                />
                            )}
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerAppbar: {
        backgroundColor: '#4caf50',
        elevation: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#2e7d32',
        marginBottom: 0,
        fontWeight: 'bold',
    },
    radioGroupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    radioContainer: {
        marginBottom: 8,
    },
    radioItem: {
        paddingVertical: 6,
        paddingHorizontal: 0,
    },
    radioLabel: {
        fontSize: 14,
        color: '#000',
    },
    textInput: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#e0e0e0',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    searchButton: {
        flex: 1,
        backgroundColor: '#4caf50',
        borderRadius: 10,
        paddingVertical: 8,
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    clearButton: {
        flex: 1,
        borderColor: '#ff9800',
        borderRadius: 10,
        paddingVertical: 8,
    },
    clearButtonText: {
        fontSize: 14,
        color: '#ff9800',
        fontWeight: '500',
    },
    buttonIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultsCountChip: {
        backgroundColor: '#e8f5e8',
    },
    // Estilos para os itens da lista de resultados
    listContent: {
        paddingTop: 8,
    },
    header: {
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    doencaNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        flex: 1,
        marginRight: 8,
    },
    icon: {
        fontSize: 16,
    },
    agenteCausador: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 8,
    },
    tipoChip: {
        backgroundColor: '#e8f5e8',
        borderColor: '#4caf50',
    },
    tipoChipText: {
        color: '#2e7d32',
        fontSize: 12,
        fontWeight: '500',
    },
    severidadeChip: {
        minWidth: 60,
    },
    severidadeChipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    regiaoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    regiaoLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    regiaoText: {
        fontSize: 12,
        color: '#333',
    },
    dataContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    dataText: {
        fontSize: 12,
        color: '#888',
    },
    actions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    actionButton: {
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default PesquisarDoencasScreen;