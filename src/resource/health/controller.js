export default (req, res) => {
  res.set('Content-Type', 'application/json')
  res.status(200).send('Here and healthy!')
}
