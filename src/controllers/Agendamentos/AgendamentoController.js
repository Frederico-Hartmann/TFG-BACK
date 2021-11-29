const pool = require('../../database/connection');
require('dotenv/config');

module.exports = {

  //GET com ID
  async listarPorDentistaEData(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idDentista = req.params.idDentista;
      const data = new Date(req.params.ano, req.params.mes, req.params.dia);

      let dataAnt = new Date(data);
      dataAnt.setDate(data.getUTCDate() - ((data.getUTCDay() == 0) ? 6 : data.getDay()) - 1);
      let dataPos = new Date(data);
      dataPos.setDate(data.getUTCDate() + 7 - ((data.getUTCDay() == 6) ? 0 : data.getUTCDay()));

      const pgSelect = {
        text: ` 
          SELECT 
            A.idAgendamento as id, A.tipo, A.inicio, A.fim, A.status, A.preco, A.descricao,
             A.idDentista, A.idCliente, C.nome, A.idClienteTratamento, A.idProcedimento
          FROM Agendamentos A
            JOIN Dentistas D ON A.idDentista = D.idDentista LEFT JOIN Clientes C ON A.idCliente = C.idCliente
            LEFT JOIN ClienteTratamento CT ON A.idClienteTratamento = CT.idClienteTratamento LEFT JOIN Procedimentos P ON A.idProcedimento = P.idProcedimento
          WHERE 
            D.idClinica = $1 AND A.idDentista = $2 AND A.inicio BETWEEN $3 AND $4
        `,
        values: [idClinica, idDentista, dataAnt, dataPos]
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
      const idAgendamento = req.params.id;

      const pgSelect = {
        text: ` 
        SELECT 
          A.idAgendamento as id,
          A.tipo,
          A.inicio,
          A.fim,
          A.descricao,
          A.status,
          A.preco,
          A.idDentista,
          A.idCliente AS id_cliente,
          C.nome AS nome_cliente,
          A.idClienteTratamento as id_tratamento,
          T.descricao || ' - ' || to_char(CT.dataInicioTratamento, 'DD/MM/YYYY') AS descricao_tratamento,
          A.idProcedimento as id_procedimento,
          P.descricao AS descricao_procedimento
        FROM Agendamentos A
          JOIN Dentistas D ON A.idDentista = D.idDentista
          LEFT JOIN Clientes C ON A.idCliente = C.idCliente
          LEFT JOIN ClienteTratamento CT ON A.idClienteTratamento = CT.idClienteTratamento
          LEFT JOIN Tratamentos T ON CT.idTratamento = T.idTratamento
          LEFT JOIN Procedimentos P ON A.idProcedimento = P.idProcedimento
        WHERE
          D.idClinica = $1 AND
          idAgendamento = $2
        `,
        values: [idClinica, idAgendamento]
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
          INSERT INTO Agendamentos (
            tipo, inicio, fim, descricao, status, preco, idDentista, 
            idCliente, idClienteTratamento, idProcedimento
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          )`,
        values: [dados.tipo, dados.inicio, dados.fim, dados.descricao, dados.status, dados.preco,
        dados.idDentista, dados.idCliente, dados.idClienteTratamento, dados.idProcedimento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgInsert, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Cadastrar Agendamento",
              cadastrado: true,
              message: "Agendamento cadastrado com sucesso!",
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
      const idAgendamento = req.params.id;

      const pgUpdate = {
        text: `
          UPDATE Agendamentos SET 
            inicio = $1,
            fim = $2,
            descricao = $3,
            status = $4,
            preco = $5,
            idCliente = $6,
            idClienteTratamento = $7,
            idProcedimento = $8
          WHERE idAgendamento = $9`,
        values: [dados.inicio, dados.fim, dados.descricao, dados.status, dados.preco,
        dados.idCliente, dados.idClienteTratamento, dados.idProcedimento, idAgendamento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Editar Agendamento",
              cadastrado: true,
              message: "Agendamento atualizado com sucesso!",
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
        text: `DELETE FROM Agendamentos WHERE idAgendamento = $1`,
        values: [idMedicamento]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgUpdate, (err, result) => {
          if (err) throw err;
          else {
            done();
            res.json({
              statusCode: 200,
              title: "Excluir Agendamento",
              deletado: true,
              message: "Agendamento excluído com sucesso!",
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