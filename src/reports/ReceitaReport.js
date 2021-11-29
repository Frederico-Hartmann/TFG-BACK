const pool = require('../database/connection');
require('dotenv/config');
const PDFDocument = require('pdfkit')
const { Base64Encode } = require('base64-stream');

async function buscarDados(idDentista, idReceita, idClinica) {
    const pgSelectMedicamentos = {
        text: `
            SELECT 
                RR.idReceitaMedicamento as id,
                RM.descricao AS descricao_medicamento,
                concat(RR.quantidade, ' ', RR.unidadeMedida) AS quantidade_unidade
            FROM 
                ReceitaMedicamento RR
                left JOIN Medicamentos RM ON RR.idMedicamento = RM.idMedicamento
            WHERE
                RR.idReceita = $1
                AND RM.idClinica = $2
            ORDER BY descricao_medicamento
         `,
        values: [idReceita, idClinica]
    }

    const pgSelectDentistaClinica = {
        text: `
            SELECT 
                D.nome,
                D.cro,
                CASE
                    WHEN E.complemento IS NOT NULL THEN E.lougradouro || ' ' || E.numero || ', ' || E.complemento
                    ELSE  E.lougradouro || ' ' || E.numero
                END AS endereco_rua,
                Ci.nome || ' ' || Ci.siglaestado AS endereco_cidade,
                C.telefone
            FROM
                dentistas D 
                join clinicas C on D.idclinica = C.idclinica
                join enderecos E on C.idendereco = E.idendereco
                join cidades Ci ON Ci.idcidade = E.idcidade
            WHERE
                D.idDentista = $1
                AND C.idClinica = $2
         `,
        values: [idDentista, idClinica]
    }

    const client = await pool.connect();

    const medicamentos = await client.query(pgSelectMedicamentos);
    const dentistaClinica = await client.query(pgSelectDentistaClinica);
    client.release();
    return [medicamentos.rows, dentistaClinica.rows[0]];
}

function criarHeader(dentista, doc) {
    doc
        .text(dentista.nome, { bold: true, align: 'center' })
        .text('Odontologia', { bold: true, align: 'center' });
    if (dentista.cro != null)
        doc.text(`CRO ${dentista.cro}`, { bold: true, align: 'center' })
}

function criarListaMedicamentos(medicamentos, doc) {
    if (medicamentos.length > 0) {
        const tableTop = 200;
        let i = 0;

        doc.moveDown().moveDown();

        for (i = 0; i < medicamentos.length; i++) {
            const item = medicamentos[i];
            const y = tableTop + (i * 15)
            doc.text(`${item.descricao_medicamento} - ${item.quantidade_unidade}`,
                { align: 'center' })
        }
    }
}

function CriarObservacao(observacao, doc){
    doc
        .moveDown()
        .moveDown()
        .text(observacao);
}

function criarFooter(clinica, doc) {
    doc
        .text(clinica.endereco_rua, 50, 675, { bold: true, align: 'center' })
        .text(clinica.endereco_cidade, { bold: true, align: 'center' });
    if (clinica.telefone)

        doc.text(clinica.telefone, { bold: true, align: 'center' })
}

module.exports = {

    async gerarRelatorio(req, res) {
        //try {
        const isAdmin = req.isAdmin;

        if (isAdmin) {
            idReceita = req.body.idReceita;
            idDentista = req.body.idDentista;
            observacao = req.body.observacao;
            idClinica = req.idClinica;

            const dados = await buscarDados(idDentista, idReceita, idClinica);

            let doc = new PDFDocument;

            criarHeader(dados[1], doc);

            criarListaMedicamentos(dados[0], doc);

            if (observacao != null && observacao.length > 0)
                CriarObservacao(observacao, doc);

            criarFooter(dados[1], doc);

            var finalString = 'data:application/pdf;base64,';
            var stream = doc.pipe(new Base64Encode());
            doc.end();

            stream.on('data', function (chunk) {
                finalString += chunk;
            });

            stream.on('end', function () {
                res.json(finalString);
            });
        } else {
            res.json({
                statusCode: 401,
                title: "Erro",
                message: "Não autorizado!"
            });
        }
        /*} catch {
            res.json({
                statusCode: 500,
                title: "Erro",
                message: "Erro ao gerar relatório !"
            });
        }*/
    },
}