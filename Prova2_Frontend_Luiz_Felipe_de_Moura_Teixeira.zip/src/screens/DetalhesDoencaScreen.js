import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { doencaService } from '../services/api';

const DetalhesDoencaScreen = ({ route, navigation }) => {
  const { doencaId } = route.params;
  const [doenca, setDoenca] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDoenca();
  }, [doencaId]);

  const carregarDoenca = async () => {
    try {
      console.log('🔄 Carregando doença ID:', doencaId);
      const response = await doencaService.buscarPorId(doencaId);
      console.log('✅ Resposta da API:', response.data);
      
      if (response.data.success) {
        setDoenca(response.data.data);
      } else {
        Alert.alert('Erro', 'Doença não encontrada');
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Erro ao carregar doença:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da doença: ' + error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a doença "${doenca.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: excluirDoenca,
        },
      ]
    );
  };

  const excluirDoenca = async () => {
    try {
      await doencaService.excluir(doencaId);
      Alert.alert('Sucesso', 'Doença excluída com sucesso!');
      navigation.navigate('ListaDoencas');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a doença: ' + error.message);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!doenca) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Doença não encontrada</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerAppbar}>
        <Appbar.Action 
          icon={() => <Text style={styles.headerActionIcon}>◀</Text>}
          color="#fff"
          onPress={() => navigation.goBack()} 
        />
        <Appbar.Content 
          title="Detalhes da Doença"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action 
          icon={() => <Text style={styles.headerActionIcon}>✏️</Text>}
          color="#fff"
          onPress={() => navigation.navigate('EditarDoenca', { doencaId })} 
        />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* CARD PRINCIPAL */}
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.doencaNome}>{doenca.nome}</Text>
                <Text style={styles.icon}>
                  {getTipoPatogenoIcon(doenca.tipo_patogeno)}
                </Text>
              </View>
              
              <Paragraph style={styles.agenteCausador}>
                {doenca.agente_causador}
              </Paragraph>
            </View>

            <View style={styles.chipsContainer}>
              <Chip 
                mode="outlined" 
                style={styles.tipoChip}
                textStyle={styles.tipoChipText}
              >
                {doenca.tipo_patogeno?.replace('_', ' ') || 'N/A'}
              </Chip>
              
              <Chip 
                mode="flat" 
                style={[
                  styles.severidadeChip,
                  { backgroundColor: getSeveridadeColor(doenca.severidade) }
                ]}
                textStyle={styles.severidadeChipText}
              >
                {getSeveridadeText(doenca.severidade)}
              </Chip>
            </View>

            {doenca.regiao && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🌍 Região: </Text>
                <Text style={styles.infoText}>{doenca.regiao}</Text>
              </View>
            )}

            {doenca.temperatura_favoravel && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🌡️ Temperatura Favorável: </Text>
                <Text style={styles.infoText}>{doenca.temperatura_favoravel}°C</Text>
              </View>
            )}

            {doenca.umidade_favoravel && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>💧 Umidade Favorável: </Text>
                <Text style={styles.infoText}>{doenca.umidade_favoravel}%</Text>
              </View>
            )}

            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                📅 Registrado em: {new Date(doenca.data_registro).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* SINTOMAS */}
        {doenca.sintomas && (
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🩺</Text>
                <Title style={styles.sectionTitle}>Sintomas</Title>
              </View>
              <Paragraph style={styles.sectionText}>
                {doenca.sintomas}
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* MÉTODOS DE CONTROLE */}
        {doenca.controle && (
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🛡️</Text>
                <Title style={styles.sectionTitle}>Métodos de Controle</Title>
              </View>
              <Paragraph style={styles.sectionText}>
                {doenca.controle}
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* AÇÕES */}
        <View style={styles.actionsContainer}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('EditarDoenca', { doencaId })}
            style={[styles.actionButton, styles.editarButton]}
            labelStyle={styles.actionButtonText}
            icon={() => <Text style={styles.buttonIcon}>✏️</Text>}
          >
            Editar
          </Button>
          <Button 
            mode="contained" 
            onPress={confirmarExclusao}
            style={[styles.actionButton, styles.excluirButton]}
            labelStyle={styles.actionButtonText}
            icon={() => <Text style={styles.buttonIcon}>🗑️</Text>}
          >
            Excluir
          </Button>
        </View>
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
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doencaNome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    flex: 1,
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  agenteCausador: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tipoChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    height: 32,
  },
  tipoChipText: {
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: '500',
  },
  severidadeChip: {
    minWidth: 70,
    height: 32,
  },
  severidadeChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  dataContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 8,
  },
  dataText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2e7d32',
    marginBottom: 0,
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'justify',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 6,
  },
  editarButton: {
    backgroundColor: '#ffa726',
  },
  excluirButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 4,
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
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
  },
});

export default DetalhesDoencaScreen;