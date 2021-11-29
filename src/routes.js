//import das libs
const express = require('express')
const routes = express.Router();
const verifyJWT = require('./middlewares/auth')

//import dos Controllers 
const LoginController = require('./controllers/Login/LoginController');
const AgendamentosController = require('./controllers/Agendamentos/AgendamentoController');
const ClienteController = require('./controllers/Clientes/ClienteController');
const ClienteTratamentoController = require('./controllers/Clientes/ClienteTratamentoController');
const ClienteDocumentoController = require('./controllers/Clientes/DocumentoController');
const RespostasAnamneseController = require('./controllers/Clientes/RespostaAnamneseController');
const PerguntasAnamneseController = require('./controllers/Anamnese/PerguntaAnamneseController');
const TratamentoController = require('./controllers/Tratamentos/TratamentoController');
const ProcedimentoController = require('./controllers/Procedimentos/ProcedimentoController');
const ReceitaController = require('./controllers/ReceitasMedicamentos/ReceitaController');
const MedicamentoController = require('./controllers/ReceitasMedicamentos/MedicamentoController');
const ReceitaMedicamentoController = require('./controllers/ReceitasMedicamentos/ReceitaMedicamentoController');
const DentistaController = require('./controllers/Dentistas/DentistaController');
const ReceitaReport = require('./reports/ReceitaReport');
const ClienteReport = require('./reports/ClienteReport');
const AgendamentoReport = require('./reports/AgendamentoReport');

//login
routes.post('/admin/login', LoginController.login);

//agendamentos
routes.get('/agendamentos/:idDentista/:dia/:mes/:ano', verifyJWT, AgendamentosController.listarPorDentistaEData);
routes.get('/agendamentos/:id', verifyJWT, AgendamentosController.buscarPorId);
routes.post('/agendamentos' , verifyJWT, AgendamentosController.cadastrar);
routes.put('/agendamentos/:id' , verifyJWT, AgendamentosController.atualizar);
routes.delete('/agendamentos/:id', verifyJWT, AgendamentosController.excluir);

//clientes
routes.get('/clientes', verifyJWT, ClienteController.listar);
routes.get('/clientes/:id', verifyJWT, ClienteController.buscarPorId);
routes.post('/clientes' , verifyJWT, ClienteController.cadastrar);
routes.put('/clientes/:id' , verifyJWT, ClienteController.atualizar);
routes.delete('/clientes/:id', verifyJWT, ClienteController.excluir);

//cliente tratamento
routes.get('/clientetratamento/', verifyJWT, ClienteTratamentoController.listar);
routes.get('/clientetratamento/:id', verifyJWT, ClienteTratamentoController.listarPorCliente);
routes.get('/clientetratamentoativo/:id', verifyJWT, ClienteTratamentoController.listarAtivosPorCliente);
routes.post('/clientetratamento' , verifyJWT, ClienteTratamentoController.cadastrar);
routes.put('/clientetratamento/:id' , verifyJWT, ClienteTratamentoController.atualizar);
routes.delete('/clientetratamento/:id', verifyJWT, ClienteTratamentoController.excluir);

//cliente documento
routes.get('/clientedocumento/:id', verifyJWT, ClienteDocumentoController.listarPorCliente);
routes.get('/clientedocumentodownload/:id', verifyJWT, ClienteDocumentoController.buscarPorId);
routes.post('/clientedocumento' , verifyJWT, ClienteDocumentoController.cadastrar);
routes.delete('/clientedocumento/:id', verifyJWT, ClienteDocumentoController.excluir);

//Respostas anamnee
routes.get('/respostas/:id', verifyJWT, RespostasAnamneseController.listarPorCliente);
routes.post('/respostas' , verifyJWT, RespostasAnamneseController.cadastrar);
routes.put('/respostas/:id' , verifyJWT, RespostasAnamneseController.atualizar);
routes.delete('/respostas/:id', verifyJWT, RespostasAnamneseController.excluir);

//Perguntas anamnese
routes.get('/perguntas', verifyJWT, PerguntasAnamneseController.listar);
routes.get('/perguntas/:id', verifyJWT, PerguntasAnamneseController.buscarPorId);
routes.post('/perguntas' , verifyJWT, PerguntasAnamneseController.cadastrar);
routes.put('/perguntas/:id' , verifyJWT, PerguntasAnamneseController.atualizar);
routes.delete('/perguntas/:id', verifyJWT, PerguntasAnamneseController.excluir);

//tratamentos
routes.get('/tratamentos', verifyJWT, TratamentoController.listar);
routes.get('/tratamentos/:id', verifyJWT, TratamentoController.buscarPorId);
routes.post('/tratamentos' , verifyJWT, TratamentoController.cadastrar);
routes.put('/tratamentos/:id' , verifyJWT, TratamentoController.atualizar);
routes.delete('/tratamentos/:id', verifyJWT, TratamentoController.excluir);

//procedimento
routes.get('/procedimentos', verifyJWT, ProcedimentoController.listar);
routes.get('/procedimentos/:id', verifyJWT, ProcedimentoController.buscarPorId);
routes.post('/procedimentos' , verifyJWT, ProcedimentoController.cadastrar);
routes.put('/procedimentos/:id' , verifyJWT, ProcedimentoController.atualizar);
routes.delete('/procedimentos/:id', verifyJWT, ProcedimentoController.excluir);

//receitas
routes.get('/receitas', verifyJWT, ReceitaController.listar);
routes.get('/receitas/:id', verifyJWT, ReceitaController.buscarPorId);
routes.post('/receitas' , verifyJWT, ReceitaController.cadastrar);
routes.put('/receitas/:id' , verifyJWT, ReceitaController.atualizar);
routes.delete('/receitas/:id', verifyJWT, ReceitaController.excluir);

//medicamentos
routes.get('/medicamentos', verifyJWT, MedicamentoController.listar);
routes.get('/medicamentos/:id', verifyJWT, MedicamentoController.buscarPorId);
routes.post('/medicamentos' , verifyJWT, MedicamentoController.cadastrar);
routes.put('/medicamentos/:id' , verifyJWT, MedicamentoController.atualizar);
routes.delete('/medicamentos/:id', verifyJWT, MedicamentoController.excluir);

//receita medicamento
routes.get('/receitamedicamento/:id', verifyJWT, ReceitaMedicamentoController.listar);
routes.post('/receitamedicamento' , verifyJWT, ReceitaMedicamentoController.cadastrar);
routes.delete('/receitamedicamento/:id', verifyJWT, ReceitaMedicamentoController.excluir);

//dentistas
routes.get('/dentistas/:somenteAtivos', verifyJWT, DentistaController.listar);
routes.get('/dentistas/:id/:somenteAtivo', verifyJWT, DentistaController.buscarPorId);
routes.post('/dentistas' , verifyJWT, DentistaController.cadastrar);
routes.put('/dentistas/:id' , verifyJWT, DentistaController.atualizar);
routes.put('/dentistasAtivos/:id' , verifyJWT, DentistaController.ativarInativar);
routes.delete('/dentistas/:id', verifyJWT, DentistaController.excluir);

//relatorios
routes.post('/relatorioreceitas/', verifyJWT, ReceitaReport.gerarRelatorio);
routes.post('/relatorioclientes/', verifyJWT, ClienteReport.visualizar);
routes.post('/relatorioagendamentos/', verifyJWT, AgendamentoReport.visualizar);

module.exports = routes;