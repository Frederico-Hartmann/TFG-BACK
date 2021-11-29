const pool = require('../../database/connection');
require('dotenv/config');

module.exports = {

  //GET
  async listar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const pgSelect = {
        text: ` 
          SELECT 
            C.idClinica  AS ID, 
            C.nome, 
            (Ci.nome || '/' || Es.nome) AS LOCALIZACAO,
          FROM Clinicas C
            JOIN Enderecos En ON En.idEndereco = C.idEndereco
            JOIN Cidades Ci ON Ci.idCidade =En.idCidade 
            JOIN Estados Es ON Es.idEstado = Ci.idEstado
        `
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
      const idClinica = req.params.id;

      const pgSelect = {
        text: ` 
          SELECT 
            C.idClinica,
            C.nome
            En.idEnderecos,
            En.tipoLougradouro,
            En.lougradouro,
            En.numero,
            En.complemento,
            En.cep,
            Ci.idCidade,
            Ci.nome,
            Es.idEstado,
            Es.nome,
            Es.sigla,
            Pa.idPais,
            Pa.nome,
            Pa.sigla
          FROM Clinicas C
            JOIN Enderecos En ON En.idEndereco = C.idEndereco
            JOIN Cidades Ci ON Ci.idCidade = En.idCidade 
            JOIN Estados Es ON Es.idEstado = Ci.idEstado
            JOIN Paises Pa ON Pa.idPais = Es.idPais 
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

  //POST
  async cadastrar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const schema = req.schema;
      const dados = req.body;

      const pgInsert = {
        text: `INSERT INTO ${schema}.FAZENDA (NOME, CEP, CIDADE, ESTADO) VALUES ($1, $2, $3, $4)`,
        values: [dados.NOME, dados.CEP, dados.CIDADE, dados.ESTADO]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Cadastrar Fazenda",
              cadastrado: true,
              message: "Fazenda cadastrada com sucesso!",
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
      const schema = req.schema;
      const dados = req.body;
      const idFazenda = req.params.id;

      const pgUpdate = {
        text: `UPDATE ${schema}.FAZENDA SET NOME = $1, CEP = $2, CIDADE = $3, ESTADO = $4 WHERE ID_FAZENDA = $5`,
        values: [dados.NOME, dados.CEP, dados.CIDADE, dados.ESTADO, idFazenda]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Fazenda",
              cadastrado: true,
              message: "Fazenda atualizada com sucesso!",
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
      const schema = req.schema;
      const idFazenda = req.params.id;

      const pgUpdate = {
        text: `DELETE FROM ${schema}.FAZENDA WHERE ID_FAZENDA = $1`,
        values: [idFazenda]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Excluir Fazenda",
              deletado: true,
              message: "Fazenda excluída com sucesso!",
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