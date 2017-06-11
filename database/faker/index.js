import fs from 'fs'
import path from 'path'
import Chance from 'chance'
const chance = new Chance() // needed for eval'ed values
const jsonSql = require('json-sql')({
  'dialect': 'postgresql',
  'separatedValues': false,
  'wrappedIdentifiers': false
})
// Load `*.js(on)` under current directory as properties
//  i.e., `users.json` will become `exports['users']` or `exports.users`
fs.readdirSync(path.join(__dirname, '/config')).forEach(file => {
  if (file.match(/\.js(on)?$/) !== null && file !== 'index.js') {
    let config = require(path.join(__dirname, '/config', file.replace(/\.js(on)?$/, '')))
    let table = Object.keys(config)[0]
    let sqlFile = path.join(__dirname, '../seeds', `R__${table}`)
    let iterations = config[table].iterations

    // Empty or create file
    fs.writeFile(`${sqlFile}.fake.sql`, '')
    let stream = fs.createWriteStream(`${sqlFile}.fake.sql`, { 'flags': 'a' })

    for (let i = iterations; i >= 1; i--) {
      let values = eval(config[table].values)
      let statements = jsonSql.build({
        type: 'insert',
        table,
        values
      })
      stream.write(`${statements.query}\r \n`)
    }
    stream.end()
    console.log(`fake seeds for ${table} created successfully!`)
  }
})
