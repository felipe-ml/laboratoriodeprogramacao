import React, { useState } from 'react';
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
    Divider,
    Snackbar,
} from 'react-native-paper';
import { doencaService, tiposPatogeno, severidades } from '../services/api';

const NovaDoencaScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
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

    const handleSalvar = async () => {
        console.log('🔘 Botão cadastrar clicado');

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

            console.log('🔄 Enviando dados para cadastro:', dados);
            const response = await doencaService.criar(dados);
            console.log('📥 Resposta da API:', response.data);

            if (response.data.success) {
                console.log('✅ Cadastro bem-sucedido!');
                mostrarSnackbar('✅ Doença cadastrada com sucesso!', 'success');

                // Aguarda 1.5 segundos antes de voltar para dar tempo de ver a mensagem
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                console.log('⚠️ Resposta não indicou sucesso');
                mostrarSnackbar('Erro ao cadastrar doença', 'error');
            }
        } catch (error) {
            console.error('❌ Erro ao cadastrar:', error);
            console.error('❌ Detalhes do erro:', error.response?.data || error.message);
            mostrarSnackbar('Não foi possível cadastrar a doença', 'error');
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

    const limparFormulario = () => {
        setFormData({
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
        setErrors({});
        mostrarSnackbar('Formulário limpo', 'success');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Appbar.Header style={styles.headerAppbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Nova Doença"
                    titleStyle={styles.headerTitle}
                />
            </Appbar.Header>

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
                            placeholder="Ex: Ferrugem Asiática"
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
                            placeholder="Ex: Phakopsora pachyrhizi"
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
                            placeholder="Descreva os principais sintomas da doença..."
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
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
                            placeholder="Descreva os métodos de controle recomendados..."
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
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
                            placeholder="Ex: Centro-Oeste, Sul, Nordeste..."
                            theme={{ colors: { text: '#000', placeholder: '#666', primary: '#4caf50' } }}
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

                {/* BOTÕES DE AÇÃO */}
                <View style={styles.actionsContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSalvar}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveButton}
                        labelStyle={styles.saveButtonText}
                        icon={() => <Text style={styles.buttonIcon}>💾</Text>}
                    >
                        Cadastrar Doença
                    </Button>

                    <View style={styles.secondaryActions}>
                        <Button
                            mode="outlined"
                            onPress={limparFormulario}
                            style={styles.clearButton}
                            labelStyle={styles.clearButtonText}
                            icon={() => <Text style={styles.buttonIcon}>🧹</Text>}
                        >
                            Limpar
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
        gap: 16,
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: '#4caf50',
        borderRadius: 10,
        paddingVertical: 8,
        elevation: 2,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    clearButton: {
        flex: 1,
        borderColor: '#ff9800',
        borderRadius: 10,
        paddingVertical: 6,
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
    cancelButton: {
        flex: 1,
        borderColor: '#f44336',
        borderRadius: 10,
        paddingVertical: 6,
    },
    cancelButtonText: {
        fontSize: 14,
        color: '#f44336',
        fontWeight: '500',
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

export default NovaDoencaScreen;