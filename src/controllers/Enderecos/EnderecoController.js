const pool = require('../../database/connection'); 
require('dotenv/config');

module.exports = {

  //GET com ID
  async buscarPorId(req, res) {
    const isAdmin = req.isAdmin;
    
    if (isAdmin) {
      const idEnderecos = req.params.id; 

      const pgSelect = {
        text: ` 
        SELECT
          E.idEnderecos, 
          E.tipoLougradouro,
          E.lougradouro,
          E.numero,
          E.complemento,
          E.cep,
          E.idCidade,
          E.nome,
          E.siglaEstado
        FROM Enderecos E
          join Cidades C on E.idCidade = C.idCidade 
        WHERE
          idEnderecos = $1
        `,
        values:[idEnderecos]
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
        text: `
          INSERT INTO Enderecos (
            tipoLougradouro, 
            lougradouro, 
            numero,
            complemento,
            cep,
            idCidade
          ) VALUES (
            $1, $2, $3, $4, $5, $6
          )`,
        values: [dados.tipoLougradouro, dados.lougradouro, dados.numero,
          dados.complemento, dados.cep, dados.idCidade] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Cadastrar Endereço",
              cadastrado: true,
              message: "Endereço cadastrado com sucesso!",
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
      const idEndereco = req.params.id;

      const pgUpdate = {
        text: `
          UPDATE Enderecos SET 
            tipoLougradouro = $1, 
            lougradouro = $2, 
            numero = $3,
            complemento = $4,
            cep = $5,
            idCidade = $6
          WHERE idEndereco = $7
        `,
        values: [dados.tipoLougradouro, dados.lougradouro, dados.numero,
          dados.complemento, dados.cep, dados.idCidade, idEndereco] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Editar Endereço",
              cadastrado: true,
              message: "Endereço atualizado com sucesso!",
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
      const idEndereco = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM Enderecos WHERE idEndereco = $1`,
        values: [idEndereco] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err; 
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {    
            done(); 
            res.json({
              statusCode: 200,
              title: "Excluir Endereço",
              deletado: true,
              message: "Endereço excluído com sucesso!",
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