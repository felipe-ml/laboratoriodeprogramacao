import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.timeout,
});

// Interceptor para logs (apenas desenvolvimento)
api.interceptors.request.use(
    (config) => {
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.message);

        if (error.code === 'ECONNABORTED') {
            error.message = 'Timeout - Servidor não respondeu a tempo';
        } else if (error.response) {
            // Servidor respondeu com status de erro
            switch (error.response.status) {
                case 404:
                    error.message = 'Recurso não encontrado';
                    break;
                case 500:
                    error.message = 'Erro interno do servidor';
                    break;
                case 400:
                    error.message = 'Dados inválidos';
                    break;
                default:
                    error.message = `Erro ${error.response.status}: ${error.response.data?.message || 'Erro desconhecido'}`;
            }
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta
            error.message = 'Não foi possível conectar ao servidor. Verifique: \n1. Se o backend está rodando\n2. Se o IP está correto\n3. Sua conexão de rede';
        }

        return Promise.reject(error);
    }
);

export const doencaService = {
    // Listar todas as doenças
    listar: () => api.get('/doencas'),

    // Buscar por ID
    buscarPorId: (id) => api.get(`/doencas/${id}`),

    // Criar nova doença
    criar: (dados) => api.post('/doencas', dados),

    // Atualizar doença
    atualizar: (id, dados) => api.put(`/doencas/${id}`, dados),

    // Excluir doença
    excluir: (id) => {
        console.log(`🗑️ API: Excluindo doença ID ${id}`);
        return api.delete(`/doencas/${id}`);
    },

    // Pesquisar doenças
    pesquisar: (filtros) => api.get('/doencas/pesquisar', { params: filtros }),

    // Health check
    health: () => api.get('/health'),
};

export const tiposPatogeno = [
    { value: 'FUNGO', label: 'Fungo' },
    { value: 'BACTERIA', label: 'Bactéria' },
    { value: 'VIRUS', label: 'Vírus' },
    { value: 'NEMATOIDE', label: 'Nematoide' },
    { value: 'OOMICETO', label: 'Oomiceto' },
];

export const severidades = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'CRITICA', label: 'Crítica' },
];

export default api;