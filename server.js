const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env

const prisma = new PrismaClient();
const app = express();

// Middleware para parsear os corpos das requisições em JSON
app.use(express.json());

// --- Rotas da API para Contatos ---

// CREATE: Adicionar um novo contato
app.post('/contatos', async (req, res) => {
  try {
    const { nome, sobrenome, data_nascimento, telefone, familia } = req.body;

    // Validação básica (garantir que campos obrigatórios estão presentes)
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }

    // Criar um novo contato no banco de dados
    const novoContato = await prisma.contato.create({
      data: {
        nome,
        sobrenome,
        // Converter string de data para objeto Date se fornecido
        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
        telefone,
        familia: familia !== undefined ? familia : false, // Valor padrão para família é false se não fornecido
      },
    });
    res.status(201).json(novoContato);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    // Lidar com erro de violação de restrição única (telefone)
    if (error.code === 'P2002' && error.meta?.target?.includes('telefone')) {
        return res.status(409).json({ error: 'Já existe um contato com este telefone.' });
    }
    res.status(500).json({ error: 'Erro interno ao criar contato.' });
  }
});

// READ: Obter todos os contatos
app.get('/contatos', async (req, res) => {
  try {
    const contatos = await prisma.contato.findMany(); // Buscar todos os contatos
    res.json(contatos);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar contatos.' });
  }
});

// READ: Obter um contato específico pelo ID
app.get('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contato = await prisma.contato.findUnique({
      where: { id: parseInt(id) }, // Garantir que o ID seja um número inteiro
    });

    if (!contato) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }
    res.json(contato);
  } catch (error) {
    console.error('Erro ao buscar contato por ID:', error);
    res.status(500).json({ error: 'Erro interno ao buscar contato.' });
  }
});

// UPDATE: Modificar um contato existente pelo ID
app.put('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, data_nascimento, telefone, familia } = req.body;

    // Validação básica (garantir que pelo menos um campo seja atualizado)
    const contatoAtualizado = await prisma.contato.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        sobrenome,
        data_nascimento: data_nascimento ? new Date(data_nascimento) : undefined, // Atualizar data somente se fornecido
        telefone,
        familia,
      },
    });
    res.json(contatoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
     // Lidar com caso em que o registro para atualização não é encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Contato não encontrado para atualização.' });
    }
    // Lidar com erro de violação de restrição única (telefone)
    if (error.code === 'P2002' && error.meta?.target?.includes('telefone')) {
        return res.status(409).json({ error: 'Já existe outro contato com este telefone.' });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar contato.' });
  }
});

// DELETE: Remover um contato pelo ID
app.delete('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contato.delete({
      where: { id: parseInt(id) },
    });
    // Retornar status 204 para indicar que o contato foi deletado com sucesso
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    // Lidar com caso onde o registro para exclusão não é encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Contato não encontrado para exclusão.' });
    }
    res.status(500).json({ error: 'Erro interno ao deletar contato.' });
  }
});

// --- Iniciar o servidor ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend rodando em http://0.0.0.0:${PORT}`);
  console.log('EndPoints da API:');
  console.log(`  POST   /contatos      - Cria um novo contato`);
  console.log(`  GET    /contatos      - Lista todos os contatos`);
  console.log(`  GET    /contatos/:id  - Obtém um contato específico`);
  console.log(`  PUT    /contatos/:id  - Atualiza um contato existente`);
  console.log(`  DELETE /contatos/:id  - Deleta um contato`);
});

// Desconectar o Prisma de maneira limpa ao encerrar o processo (prática recomendada)
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
