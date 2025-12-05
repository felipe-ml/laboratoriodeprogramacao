const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'fitopatologia_soja'
};

// Pool de conexões
let pool;

async function initDatabase() {
    try {
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await pool.getConnection();
        console.log('✅ Conectado ao banco de dados MySQL');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco:', error);
        process.exit(1);
    }
}

initDatabase();

// ========== ROTAS - ORDEM IMPORTA! ==========

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Fitopatologia Soja está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// GET - Pesquisar doenças (DEVE VIR ANTES DO /:id)
app.get('/api/doencas/pesquisar', async (req, res) => {
    try {
        const { criterio, termo, tipoPatogeno, severidade } = req.query;

        let query = 'SELECT * FROM doencas WHERE 1=1';
        const params = [];

        if (criterio && termo) {
            switch (criterio) {
                case 'nome':
                    query += ' AND LOWER(nome) LIKE LOWER(?)';
                    params.push(`%${termo}%`);
                    break;
                case 'agenteCausador':
                    query += ' AND LOWER(agente_causador) LIKE LOWER(?)';
                    params.push(`%${termo}%`);
                    break;
                case 'regiao':
                    query += ' AND LOWER(regiao) LIKE LOWER(?)';
                    params.push(`%${termo}%`);
                    break;
            }
        }

        if (tipoPatogeno) {
            query += ' AND tipo_patogeno = ?';
            params.push(tipoPatogeno);
        }

        if (severidade) {
            query += ' AND severidade = ?';
            params.push(severidade);
        }

        query += ' ORDER BY data_registro DESC';

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// GET - Listar todas as doenças
app.get('/api/doencas', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM doencas ORDER BY data_registro DESC
        `);
        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar doenças:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// POST - Criar nova doença
app.post('/api/doencas', async (req, res) => {
    try {
        const {
            nome,
            agenteCausador,
            tipoPatogeno,
            sintomas,
            controle,
            severidade,
            regiao,
            temperaturaFavoravel,
            umidadeFavoravel
        } = req.body;

        if (!nome || !agenteCausador || !tipoPatogeno || !severidade) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios: nome, agenteCausador, tipoPatogeno, severidade'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO doencas (
                nome, agente_causador, tipo_patogeno, sintomas, 
                controle, severidade, regiao, temperatura_favoravel, 
                umidade_favoravel, data_registro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
            [
                nome, agenteCausador, tipoPatogeno, sintomas,
                controle, severidade, regiao, temperaturaFavoravel,
                umidadeFavoravel
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Doença cadastrada com sucesso!',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Erro ao criar doença:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// GET - Buscar doença por ID (DEVE VIR DEPOIS das rotas específicas)
app.get('/api/doencas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(
            'SELECT * FROM doencas WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doença não encontrada'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar doença:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar doença
app.put('/api/doencas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            agenteCausador,
            tipoPatogeno,
            sintomas,
            controle,
            severidade,
            regiao,
            temperaturaFavoravel,
            umidadeFavoravel
        } = req.body;

        const [existing] = await pool.execute(
            'SELECT id FROM doencas WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doença não encontrada'
            });
        }

        await pool.execute(
            `UPDATE doencas SET 
                nome = ?, agente_causador = ?, tipo_patogeno = ?, 
                sintomas = ?, controle = ?, severidade = ?, 
                regiao = ?, temperatura_favoravel = ?, umidade_favoravel = ?
            WHERE id = ?`,
            [
                nome, agenteCausador, tipoPatogeno, sintomas,
                controle, severidade, regiao, temperaturaFavoravel,
                umidadeFavoravel, id
            ]
        );

        res.json({
            success: true,
            message: 'Doença atualizada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao atualizar doença:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// DELETE - Excluir doença
app.delete('/api/doencas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute(
            'SELECT id FROM doencas WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doença não encontrada'
            });
        }

        await pool.execute('DELETE FROM doencas WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Doença excluída com sucesso!'
        });
    } catch (error) {
        console.error('❌ Erro ao excluir doença:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 API disponível em: http://localhost:${PORT}/api`);
});