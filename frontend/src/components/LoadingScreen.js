import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';

const LoadingScreen = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌</Text>
        <Text style={[styles.text, styles.errorMessage]}>
          {error}
        </Text>
        {onRetry && (
          <Button 
            mode="contained" 
            onPress={onRetry}
            style={styles.retryButton}
          >
            Tentar Novamente
          </Button>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#dc3545',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#28a745',
    marginTop: 16,
  },
});

export default LoadingScreen;