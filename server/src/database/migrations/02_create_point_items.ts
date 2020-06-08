import Knex from 'knex'

export async function up(knex: Knex){
    //CRIAR A TABELA
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary()
        table.integer('point_id').notNullable().references('id').inTable('points')
        table.integer('item_id').notNullable().references('id').inTable('items')
    })
}

export async function down(knex: Knex){
    // VOLTAR ATRÁS (DELETAR A TABELA)
    return knex.schema.dropTable('point_item')
}

//Chave Estrangeira: references(), inTable() são utilizados para fazer a referência a tabela que você quer relacionar