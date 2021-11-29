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
            idMedicamento AS id,
            descricao
          FROM Medicamentos
          WHERE idClinica = $1
          ORDER BY descricao
        `,
        values:[idClinica]
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
      const idMedicamento = req.params.id; 

      const pgSelect = {
        text: ` 
        SELECT 
          idMedicamento AS id,
          descricao
        FROM Medicamentos
        WHERE
          idClinica = $1 AND
          idMedicamento = $2
        `,
        values:[idClinica, idMedicamento]
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
        text: `INSERT INTO Medicamentos (descricao, idClinica) VALUES ($1, $2)`,
        values: [dados.descricao, idClinica] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Medicamento",
              cadastrado: true,
              message: "Medicamento cadastrado com sucesso!",
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
      const idMedicamento = req.params.id;

      const pgUpdate = {
        text: `UPDATE Medicamentos SET descricao = $1 WHERE idMedicamento = $2`,
        values: [dados.descricao, idMedicamento] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Editar Medicamento",
              cadastrado: true,
              message: "Medicamento atualizado com sucesso!",
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
      const idMedicamento = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM Medicamentos WHERE idMedicamento = $1`,
        values: [idMedicamento] 
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
                message: `Medicamento não excluído pois esta em receita(s)`,
              });
            }
            else throw err;
          }
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Medicamento",
              deletado: true,
              message: "Medicamento excluído com sucesso!",
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