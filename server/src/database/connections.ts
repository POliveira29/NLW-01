import knex from 'knex'
import path from 'path'

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
})

export default connection

// Qual arquivo será armazenado o arquivo DB
// path.resolve: Padroniza o caminho para acesso de um arquivo
// __dirname: Variável global que retorna o caminho pro diretório do arquivo que está executando ele 
//Migrations: Histórico do banco de dados
