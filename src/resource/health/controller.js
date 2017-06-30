export default (request, response) => {
  response.set('Content-Type', 'application/json')
  response.status(200).send('Here and healthy!')
}
