const pool = require('../database/connection');
require('dotenv/config');

const selectText = (idClinica, idsClientes, somenteDevedores) => {

}

module.exports = {

  //GET
  async visualizar(req, res) {
    const isAdmin = req.isAdmin;

    if (isAdmin) {
      const idClinica = req.idClinica;
      const idsClientes = req.body.idClientes;

      const devedoresWhere = (req.body.somenteDevedores ? 'EXISTS(select true from agendamentos A where A.idCliente = C.idCliente and A.status = 1)' : 'true');
      let clientesWhere = 'true';
      if (idsClientes != null && idsClientes.length > 0)
        clientesWhere = `C.idCliente IN (${idsClientes.join()})`;


      const pgSelect = {
        text: ` 
        SELECT 
          C.idCliente,
          C.nome,
          EXISTS(select true from agendamentos A where A.idCliente = C.idCliente and A.status = 1) as devendo,
          CASE
            WHEN EXISTS(select true from agendamentos A where A.idCliente = C.idCliente and A.status = 1) THEN 'Sim'
            ELSE  'Não'
          END AS devendo_string,
          COALESCE ((select sum(preco) from agendamentos A where A.idCliente = C.idCliente and A.status = 2), 0.00) as totalPago,
          COALESCE ((select sum(preco) from agendamentos A where A.idCliente = C.idCliente and A.status = 1), 0.00) as totalNaoPago
        FROM Clientes C
        WHERE C.idClinica = $1 and ${devedoresWhere} and ${clientesWhere}
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
}