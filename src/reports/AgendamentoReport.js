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
      const dataInicial = req.body.dataInicial;
      const dataFinal = req.body.dataFinal;

      const pagosWhere = (req.body.somenteNaoPagos ? 'A.status = 1' : 'true');

      let clientesWhere = 'true';
      if (idsClientes != null && idsClientes.length > 0)
        clientesWhere = `C.idCliente IN (${idsClientes.join()})`;

      let datasWhere = 'true';
      if(dataInicial != null && dataFinal!=null)
        datasWhere = `A.inicio >= '${dataInicial} 00:00:00' and A.inicio <= '${dataFinal} 23:59:59'`;
      else if (dataInicial != null)
        datasWhere = `A.inicio >= '${dataInicial} 00:00:00'`;
      else if (dataFinal != null)
        datasWhere = `A.inicio <= '${dataFinal} 23:59:59'`;
      
      const pgSelect = {
        text: ` 
        SELECT 
          A.idAgendamento,	
          C.idCliente,
          C.nome,
          to_char(A.inicio, 'DD/MM/YYYY') as data_consulta,
          to_char(A.inicio, 'hh:mi') || ' - ' || to_char(A.fim, 'hh:mi') as horario_consulta,
          A.status,
          CASE
            WHEN A.status = 2 THEN 'Sim'
            ELSE  'Não'
          END AS pago,
          COALESCE (A.preco, 0.00) as preco
        FROM 
          Agendamentos A
          LEFT JOIN Clientes C on A.idCliente = C.idCliente
        WHERE 
          C.idClinica = $1 and 
          A.tipo = 1 and 
          ${clientesWhere} and 
          ${pagosWhere} and
          ${datasWhere}
        ORDER BY nome, A.inicio
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