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
            CT.idClienteTratamento AS id,
            CT.finalizado,
            CT.idCliente,
            CT.idTratamento,
            T.descricao || ' - ' || to_char(CT.dataInicioTratamento, 'DD/MM/YYYY') AS descricao
          FROM ClienteTratamento CT
            join Tratamentos T ON CT.idTratamento = T.idTratamento
          WHERE T.idClinica = $1
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

  //GET
  async listarPorCliente(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idCliente = req.params.id;

      const pgSelect = {
        text: ` 
          SELECT 
            CT.idClienteTratamento AS id,
            CT.finalizado,
            CASE
              WHEN CT.finalizado THEN 'Sim'
              ELSE 'Não'
            END AS finalizado_string,
            CT.dataInicioTratamento,
            CT.idTratamento,
            T.descricao || ' - ' || to_char(CT.dataInicioTratamento, 'DD/MM/YYYY') AS descricao,
            exists(select true from agendamentos A where A.idClienteTratamento = CT.idClienteTratamento) AS tem_agendamentos
          FROM ClienteTratamento CT
            join Tratamentos T ON CT.idTratamento = T.idTratamento
          WHERE T.idClinica = $1 AND CT.idCliente = $2
        `,
        values: [idClinica, idCliente]
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

  //GET
  async listarAtivosPorCliente(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idCliente = req.params.id;

      const pgSelect = {
        text: ` 
            SELECT 
              CT.idClienteTratamento AS id,
              T.descricao || ' - ' || to_char(CT.dataInicioTratamento, 'DD/MM/YYYY') AS descricao
            FROM ClienteTratamento CT
              join Tratamentos T ON CT.idTratamento = T.idTratamento
            WHERE T.idClinica = $1 AND CT.idCliente = $2
          `,
        values: [idClinica, idCliente]
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
        text: `
          INSERT INTO ClienteTratamento (
            finalizado, dataInicioTratamento, idCliente, idTratamento
          ) VALUES (
            false, $1, $2, $3
          )`,
        values: [dados.dataInicio, dados.idCliente, dados.idTratamento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Inserir Medicamento à Receita",
              cadastrado: true,
              message: "Medicamento inserido à Receita com sucesso!",
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
      const finalizado = req.body.finalizado;
      const id = req.params.id;

      const pgUpdate = {
        text: `UPDATE clientetratamento SET finalizado = $1 WHERE idClienteTratamento = $2`,
        values: [finalizado, id]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: `${finalizado ? 'Finalizar' : 'Reativar'} tratamento de cliente`,
              cadastrado: true,
              message: `Tratamento do cliente ${finalizado ? 'finalizado' : 'reativado'} com sucesso!`,
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
      const id = req.params.id;
      const pgUpdate = {
        text: `DELETE FROM clientetratamento WHERE idClienteTratamento = $1`,
        values: [id]
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
                message: `Tratamento do usuário não excluído pois possui agendamentos`,
              });
            }
            else throw err;
          }
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Excluir Tratamento do Cliente",
              deletado: true,
              message: "Tratamento do cliente excluído com sucesso!",
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