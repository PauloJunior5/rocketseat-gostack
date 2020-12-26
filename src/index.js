const { request, response } = require('express');
const express = require('express');
const {uuid, isUuid} = require('uuidv4');
const app = express();
app.use(express.json());

/**
 * Métodos HTTTP:
 * 
 * GET: Buscar informações do back-end.
 * POST: Criar informações no back-end.
 * PUT/PATCH: Alterar iformações no back-end.
 * DELETE: Deletar informações no back-end.
 */

 /**
  * Tipos de parâmetros:
  * 
  * Query Params: Filtros e paginação.
  * Route Params:Identificar recursos ao atualizar ou deletar.
  * Request Body: Contúdo na hora de criar ou editar recurso (JSON).
  */

/**
 * Middleware:
 * 
 * Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequest(request, response, next){
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next(); //Próximo middlewere.
}

function validateProjectId(request, response, next) {
    const {id} = request.params;

    console.log(id);

    if (!isUuid(id)) {
        return response.status(400).json({
            error: 'Invalid Project id!',
        })
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/', (request, response) => {
    return response.json({
        message: "Hello World!",
    });
});

app.get('/projects', (request, response) => {

    const {title} = request.query;

    const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {

    const {title, owner} = request.body;

    const project = { id: uuid(), title, owner};
    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {

    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({Error: "Project not found!"})
    }

    const project = {
        id, title, owner,
    }

    projects[projectIndex] = project;

    return response.json(project);

});

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({Error: "Project not found!"})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();

});

app.listen(3333, () => {
    console.log('🛸 Backend Started!');
});