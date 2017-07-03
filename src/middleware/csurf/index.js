export const csurfFunc = req => {
  const result =
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    (req.cookies && req.cookies['XSRF-TOKEN']) ||
    req.headers['csrf-token'] ||
    req.headers['xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token']

  return result
}
