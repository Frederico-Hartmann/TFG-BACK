const pool = require('../../database/connection');
require('dotenv/config');

module.exports = {

  //GET
  async listar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idReceita = req.params.id;

      const pgSelect = {
        text: ` 
        SELECT 
          RR.idReceitaMedicamento as id,
          RM.descricao AS descricao_medicamento,
          concat(RR.quantidade, ' ', RR.unidadeMedida) AS quantidade_unidade
        FROM 
          ReceitaMedicamento RR
          left JOIN Medicamentos RM ON RR.idMedicamento = RM.idMedicamento
        WHERE
          RR.idReceita = $1
          AND RM.idClinica = $2
        ORDER BY descricao_medicamento
        `,
        values: [idReceita, idClinica]
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
        text: `INSERT INTO ReceitaMedicamento (quantidade, unidadeMedida, idReceita, idMedicamento) VALUES ($1, $2, $3, $4 )`,
        values: [dados.quantidade, dados.unidadeMedida, dados.idReceita, dados.idMedicamento]
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

  //DELETE
  async excluir(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const ReceitaMedicamento = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM ReceitaMedicamento WHERE idReceitaMedicamento = $1`,
        values: [ReceitaMedicamento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Remover Medicamento da Receita",
              deletado: true,
              message: "Medicamento removido da Receita com sucesso!",
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