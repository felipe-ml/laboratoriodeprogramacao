import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    View,
    StyleSheet,
} from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    Card,
    Title,
    HelperText,
    RadioButton,
    Text,
    ActivityIndicator,
    Divider,
    Snackbar,
} from 'react-native-paper';
import { doencaService, tiposPatogeno, severidades } from '../services/api';

const EditarDoencaScreen = ({ route, navigation }) => {
    const { doencaId } = route.params;
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'
    const [formData, setFormData] = useState({
        nome: '',
        agenteCausador: '',
        tipoPatogeno: '',
        sintomas: '',
        controle: '',
        severidade: 'BAIXA',
        regiao: '',
        temperaturaFavoravel: '',
        umidadeFavoravel: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        carregarDoenca();
    }, [doencaId]);

    const carregarDoenca = async () => {
        try {
            console.log('🔄 Carregando doença para edição ID:', doencaId);
            const response = await doencaService.buscarPorId(doencaId);
            console.log('✅ Dados da doença:', response.data);

            if (response.data.success) {
                const doenca = response.data.data;
                setFormData({
                    nome: doenca.nome || '',
                    agenteCausador: doenca.agente_causador || '',
                    tipoPatogeno: doenca.tipo_patogeno || '',
                    sintomas: doenca.sintomas || '',
                    controle: doenca.controle || '',
                    severidade: doenca.severidade || 'BAIXA',
                    regiao: doenca.regiao || '',
                    temperaturaFavoravel: doenca.temperatura_favoravel?.toString() || '',
                    umidadeFavoravel: doenca.umidade_favoravel?.toString() || '',
                });
            } else {
                mostrarSnackbar('Doença não encontrada', 'error');
                setTimeout(() => navigation.goBack(), 2000);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar doença:', error);
            mostrarSnackbar('Não foi possível carregar os dados da doença', 'error');
            setTimeout(() => navigation.goBack(), 2000);
        } finally {
            setCarregando(false);
        }
    };

    const mostrarSnackbar = (message, type = 'success') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (!formData.nome.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        }
        if (!formData.agenteCausador.trim()) {
            novosErros.agenteCausador = 'Agente causador é obrigatório';
        }
        if (!formData.tipoPatogeno) {
            novosErros.tipoPatogeno = 'Tipo de patógeno é obrigatório';
        }

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleAtualizar = async () => {
        console.log('🔘 Botão atualizar clicado');
        
        if (!validarFormulario()) {
            mostrarSnackbar('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        setLoading(true);
        try {
            const dados = {
                ...formData,
                temperaturaFavoravel: formData.temperaturaFavoravel ?
                    parseFloat(formData.temperaturaFavoravel) : null,
                umidadeFavoravel: formData.umidadeFavoravel ?
                    parseFloat(formData.umidadeFavoravel) : null,
            };

            console.log('🔄 Enviando dados para atualização:', dados);
            const response = await doencaService.atualizar(doencaId, dados);
            console.log('📥 Resposta da API:', response.data);

            if (response.data.success) {
                console.log('✅ Atualização bem-sucedida!');
                mostrarSnackbar('✅ Doença atualizada com sucesso!', 'success');
                
                // Aguarda 1.5 segundos antes de voltar para dar tempo de ver a mensagem
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                console.log('⚠️ Resposta não indicou sucesso');
                mostrarSnackbar('Erro ao atualizar doença', 'error');
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar:', error);
            console.error('❌ Detalhes do erro:', error.response?.data || error.message);
            mostrarSnackbar('Não foi possível atualizar a doença', 'error');
        } finally {
            setLoading(false);
        }
    };

    const atualizarCampo = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
        if (errors[campo]) {
            setErrors(prev => ({ ...prev, [campo]: '' }));
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* INFORMAÇÕES BÁSICAS */}
                <Card style={styles.card} elevation={3}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>📝</Text>
                            <Title style={styles.sectionTitle}>Informações Básicas</Title>
                        </View>

                        <TextInput
                            label="Nome da Doença *"
                            value={formData.nome}
                            onChangeText={(text) => atualizarCampo('nome', text)}
                            error={!!errors.nome}
                            mode="outlined"
                            style={styles.textInput}
                            contentStyle={{ paddingVertical: 12, fontSize: 16, color: '#000' }}
                            labelStyle={{ color: '#777' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                        />
                        {errors.nome && (
                            <HelperText type="error" style={styles.errorText}>
                                {errors.nome}
                            </HelperText>
                        )}

                        <TextInput
                            label="Agente Causador *"
                            value={formData.agenteCausador}
                            onChangeText={(text) => atualizarCampo('agenteCausador', text)}
                            error={!!errors.agenteCausador}
                            mode="outlined"
                            style={styles.textInput}
                            contentStyle={{ paddingVertical: 12, fontSize: 16, color: '#000' }}
                            labelStyle={{ color: '#777' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                        />
                        {errors.agenteCausador && (
                            <HelperText type="error" style={styles.errorText}>
                                {errors.agenteCausador}
                            </HelperText>
                        )}

                        <Divider style={styles.divider} />

                        <Text style={styles.radioGroupTitle}>Tipo de Patógeno *</Text>
                        <RadioButton.Group
                            onValueChange={(value) => atualizarCampo('tipoPatogeno', value)}
                            value={formData.tipoPatogeno}
                        >
                            <View style={styles.radioContainer}>
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
                        {errors.tipoPatogeno && (
                            <HelperText type="error" style={styles.errorText}>
                                {errors.tipoPatogeno}
                            </HelperText>
                        )}

                        <Divider style={styles.divider} />

                        <Text style={styles.radioGroupTitle}>Severidade *</Text>
                        <RadioButton.Group
                            onValueChange={(value) => atualizarCampo('severidade', value)}
                            value={formData.severidade}
                        >
                            <View style={styles.radioContainer}>
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
                    </Card.Content>
                </Card>

                {/* INFORMAÇÕES ADICIONAIS */}
                <Card style={styles.card} elevation={3}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>📋</Text>
                            <Title style={styles.sectionTitle}>Informações Adicionais</Title>
                        </View>

                        <TextInput
                            label="Sintomas"
                            value={formData.sintomas}
                            onChangeText={(text) => atualizarCampo('sintomas', text)}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.textArea}
                            contentStyle={{ paddingVertical: 10, textAlignVertical: 'top', fontSize: 14, color: '#000' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                            placeholder="Descreva os principais sintomas da doença..."
                        />

                        <TextInput
                            label="Métodos de Controle"
                            value={formData.controle}
                            onChangeText={(text) => atualizarCampo('controle', text)}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.textArea}
                            contentStyle={{ paddingVertical: 10, textAlignVertical: 'top', fontSize: 14, color: '#000' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                            placeholder="Descreva os métodos de controle recomendados..."
                        />

                        <TextInput
                            label="Região"
                            value={formData.regiao}
                            onChangeText={(text) => atualizarCampo('regiao', text)}
                            mode="outlined"
                            style={styles.textInput}
                            contentStyle={{ paddingVertical: 12, fontSize: 16, color: '#000' }}
                            labelStyle={{ color: '#777' }}
                            outlineColor="#4caf50"
                            activeOutlineColor="#2e7d32"
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                            placeholder="Ex: Centro-Oeste, Sul, Nordeste..."
                        />

                        <View style={styles.rowInputs}>
                            <TextInput
                                label="Temperatura Favorável (°C)"
                                value={formData.temperaturaFavoravel}
                                onChangeText={(text) => atualizarCampo('temperaturaFavoravel', text)}
                                mode="outlined"
                                keyboardType="numeric"
                                style={[styles.textInput, styles.halfInput]}
                                contentStyle={{ paddingVertical: 12, fontSize: 18, color: '#000' }}
                                outlineColor="#4caf50"
                                activeOutlineColor="#2e7d32"
                                theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                                placeholder="Ex: 25.5"
                            />
                            <TextInput
                                label="Umidade Favorável (%)"
                                value={formData.umidadeFavoravel}
                                onChangeText={(text) => atualizarCampo('umidadeFavoravel', text)}
                                mode="outlined"
                                keyboardType="numeric"
                                style={[styles.textInput, styles.halfInput]}
                                contentStyle={{ paddingVertical: 12, fontSize: 18, color: '#000' }}
                                outlineColor="#4caf50"
                                activeOutlineColor="#2e7d32"
                                theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
                                placeholder="Ex: 80.0"
                            />
                        </View>
                    </Card.Content>
                </Card>

                {/* BOTÃO DE ATUALIZAR */}
                <View style={styles.actionsContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAtualizar}
                        loading={loading}
                        disabled={loading}
                        style={styles.updateButton}
                        labelStyle={styles.updateButtonText}
                        icon={() => <Text style={styles.buttonIcon}>💾</Text>}
                    >
                        Atualizar Doença
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelButton}
                        labelStyle={styles.cancelButtonText}
                        icon={() => <Text style={styles.buttonIcon}>◀</Text>}
                    >
                        Cancelar
                    </Button>
                </View>
            </ScrollView>

            {/* SNACKBAR PARA MENSAGENS */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={[
                    styles.snackbar,
                    snackbarType === 'success' ? styles.snackbarSuccess : styles.snackbarError
                ]}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                    labelStyle: { color: '#fff' }
                }}
            >
                <Text style={styles.snackbarText}>{snackbarMessage}</Text>
            </Snackbar>
        </KeyboardAvoidingView>
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
    headerActionIcon: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 20,
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
        marginBottom: 20,
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
    textInput: {
        marginBottom: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    textArea: {
        marginBottom: 16,
        backgroundColor: '#fff',
        minHeight: 80,
        padding: 8,
        color: '#000',
    },
    errorText: {
        marginTop: -12,
        marginBottom: 12,
        fontSize: 12,
    },
    buttonIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#e0e0e0',
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
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    actionsContainer: {
        gap: 12,
        marginTop: 8,
    },
    updateButton: {
        backgroundColor: '#4caf50',
        borderRadius: 10,
        paddingVertical: 8,
        elevation: 2,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cancelButton: {
        borderColor: '#4caf50',
        borderRadius: 10,
        paddingVertical: 8,
    },
    cancelButtonText: {
        fontSize: 14,
        color: '#4caf50',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    snackbar: {
        position: 'absolute',
        top: '50%',
        left: 16,
        right: 16,
        transform: [{ translateY: -50 }],
        borderRadius: 8,
        elevation: 6,
    },
    snackbarSuccess: {
        backgroundColor: '#4caf50',
    },
    snackbarError: {
        backgroundColor: '#f44336',
    },
    snackbarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EditarDoencaScreen;