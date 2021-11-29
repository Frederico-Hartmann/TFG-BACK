const pool = require('../../database/connection');
require('dotenv/config');

module.exports = {

  //GET
  async listar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;

      const pgSelect = {
        text: ` 
          SELECT 
            idPergunta as id,
            pergunta
          FROM PerguntasAnamnese
          WHERE idClinica = $1
        `,
        values: [idClinica]
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
  async buscarPorId(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idPergunta = req.params.id;

      const pgSelect = {
        text: ` 
        SELECT 
          idPergunta as id,
          pergunta
        FROM PerguntasAnamnese
        WHERE
          idClinica = $1 AND
          idPergunta = $2
        `,
        values: [idClinica, idPergunta]
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
      const idClinica = req.idClinica;
      const dados = req.body;

      const pgInsert = {
        text: `INSERT INTO PerguntasAnamnese (pergunta, idClinica) VALUES ($1, $2)`,
        values: [dados.pergunta, idClinica]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Cadastrar Pergunta",
              cadastrado: true,
              message: "Pergunta cadastrada com sucesso!",
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
      const idPergunta = req.params.id;

      const pgUpdate = {
        text: `UPDATE PerguntasAnamnese SET pergunta = $1 WHERE idPergunta = $2`,
        values: [dados.pergunta, idPergunta]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Pergunta",
              cadastrado: true,
              message: "Pergunta atualizada com sucesso!",
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
      const idPergunta = req.params.id;

      const pgUpdate1 = {
        text: `DELETE FROM RespostasAnamnese WHERE idPergunta = $1`,
        values: [idPergunta]
      }

      const pgUpdate2 = {
        text: `DELETE FROM PerguntasAnamnese WHERE idPergunta = $1`,
        values: [idPergunta]
      }

      pool.connect((err, client, done) => {
        if (err) {
          res.json({
            statusCode: 500,
            title: "Erro",
            message: "Erro ao se conectar com a base de dados!"
          });
        };
        client.query(pgUpdate1, (err, result) => {
          if (err) throw err;
          else {
            client.query(pgUpdate2, (err, result) => {
              if (err) throw err;
              else {
                done();
                res.json({
                  statusCode: 200,
                  title: "Excluir Pergunta",
                  deletado: true,
                  message: "Pergunta excluída com sucesso!",
                });
              }
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