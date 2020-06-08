//Rota: Endereço completo da requisição
// Recurso: Qual entidade estamos acessando no sistema

// GET: Buscar uma ou mais informações do back-end
// POST: Criar uma nova informação no back-end
// PUT: Atualizar uma informação existente no back-end
// DELETE: Remover uma informação do back-end

// Post http://localhost:3333/users = Criar um usuário
// GET http://localhost:3333/users = Listar usuários
// GET http://localhost:3333/users/5 = Listar usuários ID 5

// Request Param: Parâmetros que vem na própria rota que identificam o recurso
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros,
// Request Body: Parâmetros para criação e atualização de informações

// -- Requisições Testes --
/*
// Array usuários
const users = [
    'Diego',
    'Cleiton',
    'Robson',
    'Patrick'
]

app.get('/users', (request, response) => {
    const search = String(request.query.search)

    const filterUsers = search ? users.filter(user => user.includes(search)) : users;

    //JSON
    response.json(filterUsers);
});


app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

app.post('/users', (request, response) => {
    const data = request.body
    
    const user = {
        name: data.name,
        email: data.email
    }

    return response.json(user);
});
*/
import express, { request, response } from 'express';
import cors from 'cors'
import path from 'path'
import routes from './routes'
import { errors } from 'celebrate'

const app = express();

app.use(cors())
app.use(express.json())
app.use(routes)

// Arquivo Estatico: Imagem, pdf, world
// static(): Servir arquivos estaticos de uma pasta especifica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(3333);
