const pool = require('../../database/connection'); 
require('dotenv/config');

module.exports = {

  //GET com ID
  async listarPorCliente(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const idClinica = req.idClinica;
      const idCliente = req.params.id; 

      const pgSelect = {
        text: ` 
        SELECT 
          R.idResposta as id_resposta,
          R.resposta,
          P.idPergunta as id_pergunta,
          P.pergunta,
          R.idCliente as id_cliente
        FROM PerguntasAnamnese P
          left join RespostasAnamnese R on (R.idPergunta = P.idPergunta and R.idCliente = $1)
        WHERE
          P.idClinica = $2
        ORDER BY P.idPergunta
        `,
        values:[idCliente, idClinica]
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
        text: `INSERT INTO RespostasAnamnese (resposta, idPergunta, idCliente) VALUES ($1, $2, $3)`,
        values: [dados.resposta, dados.idPergunta, dados.idCliente] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Resposta",
              cadastrado: true,
              message: "Resposta cadastrada com sucesso!",
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

  //PUT
  async atualizar(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const dados = req.body;
      const idResposta = req.params.id;

      const pgUpdate = {
        text: `UPDATE RespostasAnamnese SET resposta = $1 WHERE idResposta = $2`,
        values: [dados.resposta, idResposta] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Editar Resposta",
              cadastrado: true,
              message: "Resposta atualizada com sucesso!",
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
      const idResposta = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM RespostasAnamnese WHERE idResposta = $1`,
        values: [idResposta] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Resposta",
              deletado: true,
              message: "Resposta excluída com sucesso!",
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