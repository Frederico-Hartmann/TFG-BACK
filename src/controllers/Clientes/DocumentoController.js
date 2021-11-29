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
            D.idDocumento as id,
            D.nome,
            D.idCliente
          FROM Documentos D
            JOIN Clientes C ON  D.idCliente =  C.idCliente
          WHERE C.idClinica = $1 AND
            D.idCliente = $2
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

  //GET com ID
  async buscarPorId(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const idClinica = req.idClinica;
      const idDocumento = req.params.id; 

      const pgSelect = {
        text: ` 
          SELECT 
            D.idDocumento as id,
            D.nome,
            D.documento,
            D.idCliente
          FROM Documentos D
            JOIN Clientes C ON  D.idCliente =  C.idCliente
          WHERE
            C.idClinica = $1 AND
            D.idDocumento = $2
        `,
        values:[idClinica, idDocumento]
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
    const idDocumento = req.params.id; 

    const pgSelect = {
      text: ` 
        SELECT 
          D.idDocumento as id,
          D.nome,
          D.documento,
          D.idCliente
        FROM Documentos D
          JOIN Clientes C ON  D.idCliente =  C.idCliente
        WHERE
          C.idClinica = $1 AND
          D.idDocumento = $2
      `,
      values:[idClinica, idDocumento]
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
        text: `INSERT INTO Documentos (nome, documento, idCliente) VALUES ($1, $2, $3)`,
        values: [dados.nome, dados.documento, dados.idCliente] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Documento",
              cadastrado: true,
              message: "Documento cadastrado com sucesso!",
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
      const idDocumento = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM Documentos WHERE idDocumento = $1`,
        values: [idDocumento] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Documento",
              deletado: true,
              message: "Documento excluído com sucesso!",
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