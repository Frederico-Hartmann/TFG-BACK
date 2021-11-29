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
            idProcedimento AS id,
            descricao,
            precoProcedimento AS preco_procedimento
          FROM Procedimentos
          WHERE idClinica = $1
          ORDER BY descricao
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
      const idProcedimento = req.params.id;

      const pgSelect = {
        text: ` 
        SELECT 
          idProcedimento AS id,
          descricao,
          precoProcedimento AS preco_procedimento
        FROM Procedimentos
        WHERE
          idClinica = $1 AND
          idProcedimento = $2
        `,
        values: [idClinica, idProcedimento]
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
        text: `INSERT INTO Procedimentos (descricao, precoProcedimento, idClinica) VALUES ($1, $2, $3)`,
        values: [dados.descricao, dados.precoProcedimento, idClinica]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Cadastrar Procedimento",
              cadastrado: true,
              message: "Procedimentos cadastrado com sucesso!",
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
      const idProcedimento = req.params.id;

      const pgUpdate = {
        text: `UPDATE Procedimentos SET descricao = $1, precoProcedimento = $2 WHERE idProcedimento = $3`,
        values: [dados.descricao, dados.precoProcedimento, idProcedimento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Procedimento",
              cadastrado: true,
              message: "Procedimentos atualizado com sucesso!",
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
          if (err) {
            if (err.code === "23503") {
              done();
              res.json({
                statusCode: 403,
                title: "Erro",
                error: false,
                message: `Procedimento não excluído pois possui agendamentos`,
              });
            }
            else throw err;
          }
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