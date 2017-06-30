export default (router, routes) => {
  return routes.map(route => {
    let namespace = route.toLowerCase().split('/').reverse()[1]
    let obj = require(route)
    Object.keys(obj).forEach(version => {
      Object.keys(obj[version]).forEach(method => {
        Object.keys(obj[version][method]).forEach(resource => {
          let controller = obj[version][method][resource]
          router[method].call(router, `/${version}/${namespace}${resource}`, controller)
        })
      })
    })
    return router
  })
}
