const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); 

const prisma = new PrismaClient();
const app = express();

const cors = require('cors');
app.use(cors()); // Liberação do cors 


// Middleware to parse JSON bodies
app.use(express.json());

// --- API Routes for Contatos ---

app.post('/contatos', async (req, res) => {
  try {
    const { nome, sobrenome, data_nascimento, telefone, familia } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }

    const novoContato = await prisma.contato.create({
      data: {
        nome,
        sobrenome,
        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
        telefone,
        familia: familia !== undefined ? familia : false, 
      },
    });
    res.status(201).json(novoContato);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('telefone')) {
        return res.status(409).json({ error: 'Já existe um contato com este telefone.' });
    }
    res.status(500).json({ error: 'Erro interno ao criar contato.' });
  }
});

// READ: Buscando todos Contatos
app.get('/contatos', async (req, res) => {
  try {
    const contatos = await prisma.contato.findMany();
    res.json(contatos);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar contatos.' });
  }
});

// READ: Buscando contato específico pelo id
app.get('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contato = await prisma.contato.findUnique({
      where: { id: parseInt(id) }, 
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

// UPDATE: Modify an existing contact by ID
app.put('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, data_nascimento, telefone, familia } = req.body;

    const contatoAtualizado = await prisma.contato.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        sobrenome,
        data_nascimento: data_nascimento ? new Date(data_nascimento) : undefined, 
        telefone,
        familia,
      },
    });
    res.json(contatoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
     // Contato não encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Contato não encontrado para atualização.' });
    }
    // Contato existente com o mesmo número
    if (error.code === 'P2002' && error.meta?.target?.includes('telefone')) {
        return res.status(409).json({ error: 'Já existe outro contato com este telefone.' });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar contato.' });
  }
});

// DELETE: Contato por id
app.delete('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contato.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Contato não encontrado para exclusão.' });
    }
    res.status(500).json({ error: 'Erro interno ao deletar contato.' });
  }
});

// --- Server Start ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend rodando em http://127.0.0.1:${PORT}`);
  console.log('API Endpoints:');
  console.log(`  POST   /contatos      - Cria um novo contato`);
  console.log(`  GET    /contatos      - Lista todos os contatos`);
  console.log(`  GET    /contatos/:id  - Obtém um contato específico`);
  console.log(`  PUT    /contatos/:id  - Atualiza um contato existente`);
  console.log(`  DELETE /contatos/:id  - Deleta um contato`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

