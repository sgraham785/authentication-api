var fs = require('fs')
var faker = require('faker')
var dataPath = 'seeds/data/'

var users = []
var todos = []

/* Create users */
for (var u = 10; u >= 0; u--) {
  var user_id = faker.random.number()

  var usersArray = {
    'id': user_id,
    'first_name': faker.name.firstName(),
    'last_name': faker.name.lastName(),
    'email': faker.internet.email(),
    'password': faker.internet.password(),
    'code': faker.finance.account(),
    'verified': faker.random.boolean()
  }
  users.push(usersArray)

  /* Create todos for users */
  for (var t = 12; t >= 0; t--) {
    var todosArray = {
      'user_id': user_id,
      'text': faker.hacker.phrase(),
      'complete': faker.random.boolean()
    }
    todos.push(todosArray)
  }
}

fs.writeFile(dataPath + 'users.json', JSON.stringify(users), function () {
  console.log('users generated successfully!')
})

fs.writeFile(dataPath + 'todos.json', JSON.stringify(todos), function () {
  console.log('todos generated successfully!')
})
