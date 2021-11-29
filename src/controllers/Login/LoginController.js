const pool = require('../../database/connection'); //Import connection
const bcrypt = require('bcryptjs'); //Import bcrypt
const jwt = require('jsonwebtoken');
require('dotenv/config');

//Gera um token que expira em 12 horas -> 43200
function generateToken(params = {}) {
  return jwt.sign(params, process.env.AUTHKEY, {
    expiresIn: 43200,
  });
}

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body;

    if (senha && senha.length < 200) {
      const pgSelect = {
        text: `
          SELECT 
            U.idUsuario AS id_usuario, 
            U.email, 
            U.senha, 
            U.administrador,
            U.idClinica AS id_clinica 
          FROM USUARIOS U
          WHERE U.email = $1 
        `,
        values: [email]
      }
      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(pgSelect, (err, result) => {
          if (err) throw err;
          done();
          if (result.rows.length === 0) {
            res.json({
              statusCode: 404,
              title: "Erro",
              message: "Login não encontrado!"
            })
          } else {
            const comparaSenha = bcrypt.compareSync(senha, result.rows[0].senha);
            if (comparaSenha) {
              const token = generateToken({ idUsuario: result.rows[0].id_usuario, idClinica: result.rows[0].id_clinica, contaAdm: result.rows[0].administrador, isAdmin: true });
              res.json({
                statusCode: 200,
                token: token
              });
            } else {
              res.json({
                statusCode: 403,
                title: "Erro",
                message: "Senha incorreta!"
              })
            }
          }
        });
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "Preencha os campos obrigatórios."
      });
    }
  }
}