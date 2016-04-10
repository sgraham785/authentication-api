exports.up = function (trx) {
  return trx.schema
    // Users
    .createTable('users', function (t) {
      t.increments('id').primary()
      t.string('first_name').notNullable()
      t.string('last_name').notNullable()
      t.string('email').notNullable().unique()
      t.string('password').notNullable()
      t.string('code').notNullable().unique()
      t.boolean('verified').defaultTo('false')
      t.timestamp('created_at').notNullable().defaultTo(trx.fn.now())
      t.timestamp('updated_at').notNullable().defaultTo(trx.fn.now())
    })
    // Todos
    .createTable('todos', function (t) {
      t.increments('id').primary()
      t.integer('user_id').notNullable().references('id').inTable('users')
      t.text('text').notNullable()
      t.boolean('complete').notNullable().defaultTo('false')
      t.timestamp('created_at').notNullable().defaultTo(trx.fn.now())
      t.timestamp('updated_at').notNullable().defaultTo(trx.fn.now())
    })
}

exports.down = function (trx) {
  console.log('Dropping tables')
  return trx.schema
    .dropTable('todos')
    .dropTable('users')
}
