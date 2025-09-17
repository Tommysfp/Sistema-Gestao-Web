const express = require('express');
const cors = require('cors');
const db = require('./db'); // importa conexão com MySQL

const app = express();
// Middleware para autenticação JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = usuario;
    next();
  });
}

// Middlewares globais
app.use(cors());
app.use(express.json()); // ESSENCIAL para ler JSON
app.use(express.urlencoded({ extended: true })); // para ler formulários

// Rota inicial
app.get('/', (req, res) => {
  res.send('API do Sistema de Gestão funcionando!');
});

// ==================== ROTAS PRODUTOS ====================

// Listar produtos
app.get('/produtos',autenticarToken, (req, res) => {
  db.query('SELECT * FROM produtos WHERE ativo = TRUE', (err, results) => {
  if (err) return res.status(500).json(err);
  res.json(results);
});

});

// Criar produto
app.post('/produtos',autenticarToken, (req, res) => {
  console.log(req.body); // debug para ver se está chegando
  const { nome, descricao, preco, quantidade, categoria } = req.body;

  if (!nome || !preco || !quantidade) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  db.query(
    'INSERT INTO produtos (nome, descricao, preco, quantidade, categoria) VALUES (?, ?, ?, ?, ?)',
    [nome, descricao, preco, quantidade, categoria],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, nome, descricao, preco, quantidade, categoria });
    }
  );
});

// Atualizar produto
app.put('/produtos/:id',autenticarToken, (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade, categoria } = req.body;

  db.query(
    'UPDATE produtos SET nome=?, descricao=?, preco=?, quantidade=?, categoria=? WHERE id=?',
    [nome, descricao, preco, quantidade, categoria, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, nome, descricao, preco, quantidade, categoria });
    }
  );
});

// Deletar produto
app.delete('/produtos/:id', autenticarToken, (req, res) => {
  const { id } = req.params;
  db.query('UPDATE produtos SET ativo = FALSE WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Produto marcado como inativo' });
  });
});


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = 'tommy_super_secreto'; // ideal usar .env depois

// Repor estoque de um produto
app.put('/produtos/:id/repor', autenticarToken, (req, res) => {
  const { id } = req.params;
  const { quantidade_repor } = req.body;

  if (!quantidade_repor || quantidade_repor <= 0) {
    return res.status(400).json({ error: 'Quantidade de reposição inválida' });
  }

  db.query(
    'UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?',
    [quantidade_repor, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json({ message: `Estoque do produto ${id} atualizado com +${quantidade_repor}` });
    }
  );
});


// ==================== ROTAS FUNCIONÁRIOS ====================

// Listar funcionários
app.get('/funcionarios', autenticarToken, (req, res) => {
  db.query('SELECT * FROM funcionarios', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Deletar funcionário
app.delete('/funcionarios/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM funcionarios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.json({ message: 'Funcionário excluído com sucesso' });
  });
});

app.post('/funcionarios', autenticarToken, (req, res) => {
  const { nome, cargo, salario, data_admissao } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O campo nome é obrigatório' });
  }

  db.query(
    'INSERT INTO funcionarios (nome, cargo, salario, data_admissao) VALUES (?, ?, ?, ?)',
    [nome, cargo, salario, data_admissao],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({
        id: result.insertId,
        nome,
        cargo,
        salario,
        data_admissao
      });
    }
  );
});

// ==================== ROTAS CLIENTES ====================

// Listar clientes
app.get('/clientes', autenticarToken, (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Cadastrar cliente
app.post('/clientes', autenticarToken, (req, res) => {
  const { nome, contato, endereco } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O campo nome é obrigatório' });
  }

  db.query(
    'INSERT INTO clientes (nome, contato, endereco) VALUES (?, ?, ?)',
    [nome, contato, endereco],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, nome, contato, endereco });
    }
  );
});

// Atualizar cliente
app.put('/clientes/:id', autenticarToken, (req, res) => {
  const { id } = req.params;
  const { nome, contato, endereco } = req.body;

  db.query(
    'UPDATE clientes SET nome=?, contato=?, endereco=? WHERE id=?',
    [nome, contato, endereco, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, nome, contato, endereco });
    }
  );
});

// Deletar cliente
app.delete('/clientes/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM clientes WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente excluído com sucesso' });
  });
});

// Buscar cliente por ID
app.get('/clientes/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(results[0]);
  });
});


// ==================== ROTAS VENDAS ====================

// Criar venda com controle de estoque
app.post('/vendas', autenticarToken, async (req, res) => {
  const { cliente_id, itens } = req.body;

  if (!Array.isArray(itens) || itens.length === 0)
 {
    return res.status(400).json({ error: 'Dados da venda incompletos' });
  }

  // Verificar estoque de cada produto
  const verificarEstoque = async () => {
    for (const item of itens) {
      const [produto] = await new Promise((resolve, reject) => {
        db.query('SELECT quantidade FROM produtos WHERE id = ?', [item.produto_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (!produto || produto.quantidade < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ID ${item.produto_id}`);
      }
    }
  };

  try {
    await verificarEstoque();

    const valor_total = itens.reduce((total, item) => {
      return total + item.quantidade * item.preco_unitario;
    }, 0);

    db.query(
      'INSERT INTO vendas (cliente_id, valor_total) VALUES (?, ?)',
      [cliente_id || null, valor_total],
      (err, result) => {
        if (err) return res.status(500).json(err);

        const venda_id = result.insertId;
        const valores = itens.map(item => [
          venda_id,
          item.produto_id,
          item.quantidade,
          item.preco_unitario
        ]);

        db.query(
          'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES ?',
          [valores],
          (err2) => {
            if (err2) return res.status(500).json(err2);

            // Atualizar estoque
            itens.forEach(item => {
              db.query(
                'UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?',
                [item.quantidade, item.produto_id]
              );
            });

            res.json({ venda_id, cliente_id, valor_total, itens });
          }
        );
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Listar todas as vendas
app.get('/vendas', autenticarToken, (req, res) => {
  const sql = `
    SELECT v.id, v.data_venda, v.valor_total, c.nome AS cliente
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.data_venda DESC

  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Detalhar uma venda específica
app.get('/vendas/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  const vendaSql = `
    SELECT v.id, v.data_venda, v.valor_total, c.nome AS cliente
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = ?

  `;

  const itensSql = `
    SELECT iv.produto_id, p.nome AS produto, iv.quantidade, iv.preco_unitario
    FROM itens_venda iv
    JOIN produtos p ON iv.produto_id = p.id
    WHERE iv.venda_id = ?
  `;

  db.query(vendaSql, [id], (err, vendaResult) => {
    if (err) return res.status(500).json(err);
    if (vendaResult.length === 0) return res.status(404).json({ error: 'Venda não encontrada' });

    db.query(itensSql, [id], (err2, itensResult) => {
      if (err2) return res.status(500).json(err2);
      res.json({
        venda: vendaResult[0],
        itens: itensResult
      });
    });
  });
});

  


// ==================== ROTAS USUÁRIOS ====================

// Cadastro de usuário
app.post('/usuarios/cadastrar', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Campos obrigatórios' });

  try {
    const hash = await bcrypt.hash(senha, 10);
    db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, nome, email });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login de usuário
app.post('/usuarios/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const usuario = results[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// ==================== INICIAR SERVIDOR ====================
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
