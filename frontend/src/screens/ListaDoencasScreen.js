import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Alert,
    RefreshControl,
    StyleSheet,
    Platform,
} from 'react-native';
import {
    Appbar,
    Card,
    Title,
    Paragraph,
    Chip,
    FAB,
    Menu,
    Button,
    ActivityIndicator,
    Text,
    Portal,
} from 'react-native-paper';
import { doencaService } from '../services/api';

const ListaDoencasScreen = ({ navigation }) => {
    const [doencas, setDoencas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const carregarDoencas = async () => {
        try {
            const response = await doencaService.listar();
            if (response.data.success) {
                setDoencas(response.data.data);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as doenças');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        carregarDoencas();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        carregarDoencas();
    };

    const confirmarExclusao = (doenca) => {
        console.log('🎯 BOTÃO DE EXCLUSÃO CLICADO!');
        console.log('📝 Doença:', doenca.nome);
        console.log('🆔 ID:', doenca.id);
        // On web Alert.alert does not support button callbacks — use window.confirm
        if (Platform.OS === 'web') {
            const ok = window.confirm(`Deseja realmente excluir a doença "${doenca.nome}"?`);
            if (ok) excluirDoenca(doenca.id);
            return;
        }

        Alert.alert(
            'Confirmar Exclusão',
            `Deseja realmente excluir a doença "${doenca.nome}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: () => excluirDoenca(doenca.id),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const excluirDoenca = async (id) => {
        console.log('🚀 EXCLUIR DOENCA INICIADA - ID:', id);
        setDeletingId(id);

        try {
            console.log('📡 Fazendo requisição DELETE para API...');
            const response = await doencaService.excluir(id);
            console.log('✅ Resposta da API:', response.data);

            Alert.alert('Sucesso', 'Doença excluída com sucesso!');

            // Atualizar a lista
            setDoencas(prev => prev.filter(doenca => doenca.id !== id));

        } catch (error) {
            console.error('💥 ERRO NA EXCLUSÃO:', error);
            console.error('📊 Status:', error.response?.status);
            console.error('📄 Data:', error.response?.data);
            console.error('🔧 Mensagem:', error.message);

            Alert.alert('Erro', `Não foi possível excluir a doença: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
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
                        <View style={styles.iconsContainer}>
                            <Text style={styles.icon}>
                                {getTipoPatogenoIcon(item.tipo_patogeno)}
                            </Text>
                        </View>
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
                >
                    👁️ Detalhes
                </Button>
                <Button
                    mode="outlined"
                    compact
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonText}
                    onPress={() => navigation.navigate('EditarDoenca', { doencaId: item.id })}
                >
                    ✏️ Editar
                </Button>
                <Button
                    mode="contained"
                    compact
                    style={[styles.actionButton, styles.excluirButton]}
                    labelStyle={styles.excluirButtonText}
                    onPress={() => confirmarExclusao(item)}
                    loading={deletingId === item.id}
                    disabled={deletingId !== null}
                >
                    🗑️ Excluir
                </Button>
            </Card.Actions>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={styles.loadingText}>Carregando doenças...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.headerAppbar}>
                <Appbar.Content
                    title={
                        <View style={styles.titleContainerAppbar}>
                            <Text style={styles.headerTitle}>🌱 Doenças da Soja</Text>
                            <Text style={styles.headerSubtitle}>Sistema Fitopatologia</Text>
                        </View>
                    }
                />
                <Appbar.Action
                    // fallback textual icon to ensure visibility on web
                    icon={() => <Text style={styles.headerActionIcon}>🔍</Text>}
                    color="#fff"
                    onPress={() => navigation.navigate('PesquisarDoencas')}
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Appbar.Action
                            icon={() => <Text style={styles.headerActionIcon}>⋮</Text>}
                            color="#fff"
                            onPress={() => setMenuVisible(true)}
                        />
                    }
                >
                    <Menu.Item
                        title="Pesquisar"
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate('PesquisarDoencas');
                        }}
                    />
                </Menu>
            </Appbar.Header>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{doencas.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {doencas.filter(d => d.severidade === 'CRITICA').length}
                    </Text>
                    <Text style={styles.statLabel}>Críticas</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {doencas.filter(d => d.severidade === 'ALTA').length}
                    </Text>
                    <Text style={styles.statLabel}>Altas</Text>
                </View>
            </View>

            <FlatList
                data={doencas}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4caf50']}
                    />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🌱</Text>
                        <Text style={styles.emptyTitle}>Nenhuma doença cadastrada</Text>
                        <Text style={styles.emptyText}>
                            Clique no botão + para cadastrar a primeira doença
                        </Text>
                    </View>
                }
            />

            <Portal>
                <FAB
                    style={[styles.fab, Platform.OS === 'web' && styles.fabWeb]}
                    icon={() => (
                        <View style={styles.fabIconWrapper}>
                            <Text style={styles.fabIcon}>＋</Text>
                        </View>
                    )}
                    color="#fff"
                    onPress={() => navigation.navigate('NovaDoenca')}
                />
            </Portal>
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
    titleContainerAppbar: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#e8f5e8',
        fontSize: 12,
    },
    headerActionIcon: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
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
    iconsContainer: {
        flexDirection: 'row',
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
        color: '#000',
        fontWeight: '500',
    },
    regiaoText: {
        fontSize: 12,
        color: '#000',
    },
    dataContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    dataText: {
        fontSize: 12,
        color: '#000',
    },
    actions: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    actionButton: {
        marginHorizontal: 2,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 12,
        color: '#000',
    },
    excluirButton: {
        backgroundColor: '#f44336',
    },
    excluirButtonText: {
        color: '#000',
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
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
        fontSize: 64,
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#4caf50',
        zIndex: 1000,
        elevation: 6,
    },
    fabWeb: {
        position: 'fixed',
        right: 16,
        bottom: 16,
        backgroundColor: '#4caf50',
        zIndex: 10000,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 30,
        lineHeight: 34,
        textAlign: 'center',
    },
    fabIconWrapper: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ListaDoencasScreen;