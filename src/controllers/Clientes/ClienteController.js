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
          idCliente AS id, nome,
          CASE WHEN email is null THEN '-' ELSE email END AS email,
          CASE WHEN telefone is null THEN '-' ELSE telefone END AS telefone
        FROM Clientes
        WHERE idClinica = $1
        ORDER BY nome
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
      const idCliente = req.params.id; 

      const pgSelect = {
        text: ` 
        SELECT 
          idCliente AS id,
          nome,
          cpf,
          rg,
          email,
          telefone,
          genero,
          to_char(dataNascimento, 'YYYY-MM-DD') AS dataNascimento,
          to_char(dataNascimento, 'DD/MM/YYYY') AS dataNascimento_br,
          observacao,
          receberMensagens,
          idClinica
        FROM Clientes
        WHERE
          idClinica = $1 AND
          idCliente = $2
        `,
        values:[idClinica, idCliente]
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
        text:`
        INSERT INTO Clientes (
          nome, cpf, rg, email, telefone, genero, 
          dataNascimento, observacao, receberMensagens, idClinica
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )`,
        values: [ dados.nome, dados.cpf, dados.rg, dados.email,dados.telefone, dados.genero, 
                  dados.dataNascimento, dados.observacao, dados.receberMensagens, idClinica] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Cliente",
              cadastrado: true,
              message: "Cliente cadastrado com sucesso!",
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
      const idCliente = req.params.id;
      const pgUpdate = {
        text: ` UPDATE Clientes SET
                  nome = $1, cpf = $2, rg = $3, email = $4, 
                  telefone = $5, genero = $6, dataNascimento = $7,
                  observacao = $8, receberMensagens = $9
                WHERE idCliente = $10`,
        values: [ dados.nome, dados.cpf, dados.rg, dados.email,dados.telefone, dados.genero, 
                  dados.dataNascimento, dados.observacao, dados.receberMensagens, idCliente] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Editar Cliente",
              cadastrado: true,
              message: "Cliente atualizado com sucesso!",
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
      const idCliente = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM Clientes WHERE idCliente = $1`,
        values: [idCliente] 
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
                error: true,
                message: `Cliente não excluído pois possui ${(err.table === 'receitamedicamento')? 'tratamentos':err.table}`,
              });
            }
            else throw err;
          }
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Cliente",
              deletado: true,
              message: "Cliente excluído com sucesso!",
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