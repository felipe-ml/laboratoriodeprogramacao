import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

// Serviços
import { doencaService } from './src/services/api';

// Componentes
import LoadingScreen from './src/components/LoadingScreen';

// Telas
import ListaDoencasScreen from '../frontend/src/screens/ListaDoencasScreen';
import NovaDoencaScreen from '../frontend/src/screens/NovaDoencaScreen';
import EditarDoencaScreen from '../frontend/src/screens/EditarDoencaScreen';
import DetalhesDoencaScreen from '../frontend/src/screens/DetalhesDoencaScreen';
import PesquisarDoencasScreen from '../frontend/src/screens/PesquisarDoencasScreen';

const Stack = createStackNavigator();

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      setAppLoading(true);
      setAppError(null);
      
      console.log('🔍 Verificando conexão com a API...');
      const response = await doencaService.health();
      
      if (response.data.success) {
        console.log('✅ Conectado à API com sucesso!');
        setApiConnected(true);
      }
    } catch (error) {
      console.error('❌ Erro na conexão com a API:', error.message);
      setAppError(
        `Não foi possível conectar ao servidor.\n\n` +
        `Certifique-se que:\n` +
        `• O backend está rodando (npm run dev)\n` +
        `• O IP está configurado corretamente\n` +
        `• Ambos estão na mesma rede\n\n` +
        `Erro: ${error.message}`
      );
      setApiConnected(false);
    } finally {
      setAppLoading(false);
    }
  };

  // Tela de loading/erro
  if (appLoading || appError) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <LoadingScreen 
            loading={appLoading}
            error={appError}
            onRetry={checkApiConnection}
          />
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="ListaDoencas"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#28a745',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="ListaDoencas" 
            component={ListaDoencasScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="NovaDoenca" 
            component={NovaDoencaScreen}
            options={{ title: 'Nova Doença' }}
          />
          <Stack.Screen 
            name="EditarDoenca" 
            component={EditarDoencaScreen}
            options={{ title: 'Editar Doença' }}
          />
          <Stack.Screen 
            name="DetalhesDoenca" 
            component={DetalhesDoencaScreen}
            options={{ title: 'Detalhes da Doença' }}
          />
          <Stack.Screen 
            name="PesquisarDoencas" 
            component={PesquisarDoencasScreen}
            options={{ title: 'Pesquisar Doenças' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});