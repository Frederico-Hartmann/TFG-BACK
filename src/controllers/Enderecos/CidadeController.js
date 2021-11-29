const pool = require('../../database/connection'); 
require('dotenv/config');

module.exports = {

  //GET com ID
  async buscarPorId(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const idCidade = req.params.id; 

      const pgSelect = {
        text: ` 
        SELECT 
          idCidade,
          nome,
          siglaEstado
        FROM Cidades
        WHERE
          idCidade = $1
        `,
        values:[idCidade]
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgSelect, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json(result.rows);
          }
        }); 
      }); 
    } else {
      res.json({
          statusCode: 401,
          title: "Erro",
          message: "Não autorizado!"
      });
    }
  },

    //GET com ID
  async buscarPorNomeEstado(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const NomeCidade = req.params.nome;
      const SiglaEstado = req.params.estado;  

      const pgSelect = {
        text: ` 
        SELECT 
          idCidade,
          nome,
          siglaEstado
        FROM Cidades
        WHERE
          nome = $1,
          siglaEstado = $2
        `,
        values:[NomeCidade, SiglaEstado]
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgSelect, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json(result.rows);
          }
        }); 
      }); 
    } else {
      res.json({
          statusCode: 401,
          title: "Erro",
          message: "Não autorizado!"
      });
    }
  },

  //POST
  async cadastrar(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const dados = req.body;

      const pgInsert = {
        text: `INSERT INTO Cidades (nome, siglaEstado) VALUES ($1, $2)`,
        values: [dados.nome, dados.siglaEstado] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Cidade",
              cadastrado: true,
              message: "Cidade cadastrada com sucesso!",
            });
          }
        }); 
      }); 
    } else {
      res.json({
          statusCode: 401,
          title: "Erro",
          message: "Não autorizado!"
      });
    } 
  },

  //DELETE
  async excluir(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const idProcedimento = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM Procedimentos WHERE idProcedimento = $1`,
        values: [idProcedimento] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Procedimento",
              deletado: true,
              message: "Procedimento excluído com sucesso!",
            });
          }
        }); 
      }); 
    } else {
      res.json({
          statusCode: 401,
          title: "Erro",
          message: "Não autorizado!"
      });
    } 
  }, 
}