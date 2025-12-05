// Configuração da API - AJUSTE O IP PARA O SEU COMPUTADOR
import axios from 'axios';
export const API_CONFIG = {
  // Para dispositivo físico: use o IP da sua rede local
  // BASE_URL: 'http://192.168.1.100:3000/api',
  
  // Para emulador Android:
  // BASE_URL: 'http://10.0.2.2:3000/api',

  BASE_URL: 'http://localhost:3000/api',
  
  // Para Expo Go (ajuste conforme seu IP):
  BASE_URL: 'http://191.52.73.228:3000/api', // SUBSTITUA pelo IP do seu computador
  
  timeout: 15000,  

};

const API_BASE_URL = "http://http://191.52.73.228:3000/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})
