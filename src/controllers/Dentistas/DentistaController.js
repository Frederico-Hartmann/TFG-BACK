const pool = require('../../database/connection');
require('dotenv/config');

module.exports = {

  //GET

  async listar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const somenteAtivos = (req.params.somenteAtivos==='true') ? 'ativo = TRUE' : 'TRUE';

      const pgSelect = {
        text: ` 
          SELECT 
            idDentista AS id,
            nome,
            ativo,
            CASE
              WHEN ativo THEN 'Sim'
              ELSE  'Não'
            END AS ativo_string,
            exists(select true from agendamentos where idDentista = D.idDentista) AS tem_agendamentos
          FROM Dentistas D
          WHERE idClinica = $1 AND ${somenteAtivos}
          ORDER BY nome
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
      const idDentista = req.params.id;

      const pgSelect = {
        text: ` 
        SELECT 
          idDentista AS id,
          nome,
          cro,
          ativo
        FROM Dentistas
        WHERE
          idClinica = $1 AND
          idDentista = $2
        `,
        values: [idClinica, idDentista]
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
        text: `INSERT INTO Dentistas (nome, cro, ativo, idClinica) VALUES ($1, $2, true, $3)`,
        values: [dados.nome, dados.CRO, idClinica]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Cadastrar Dentista",
              cadastrado: true,
              message: "Dentista cadastrado com sucesso!",
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
      const idDentista = req.params.id;

      const pgUpdate = {
        text: `UPDATE Dentistas SET nome = $1, cro = $2, ativo = $3 WHERE idDentista = $4`,
        values: [dados.nome, dados.CRO, dados.ativo, idDentista]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Dentista",
              cadastrado: true,
              message: "Dentista atualizado com sucesso!",
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
  async ativarInativar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const dados = req.body;
      const idDentista = req.params.id;
      const pgUpdate = {
        text: `UPDATE Dentistas SET ativo = $1 WHERE idDentista = $2`,
        values: [dados.ativo, idDentista]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Dentista",
              cadastrado: true,
              message: "Dentista atualizado com sucesso!",
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
      const idDentista = req.params.id;
      
      const pgUpdate = {
        text: `DELETE FROM Dentistas WHERE idDentista = $1`,
        values: [idDentista]
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
                message: `Dentista não excluído pois possui agendamentos`,
              });
            }
            else throw err;
          }
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Excluir Dentista",
              deletado: true,
              message: "Dentista excluída com sucesso!",
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