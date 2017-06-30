const path = require('path')
const glob = require('glob')
const express = require('express')

let convertGlobPaths = (globs) => {
  return globs.reduce((acc, globString) => {
    let globFiles = glob.sync(globString)
    return acc.concat(globFiles)
  }, [])
}

let routePaths = convertGlobPaths([path.resolve(__dirname, 'resources/**/routes.js')])

var app = express()
const routeBuilder = (router, routes) => {
  routes.map(route => {
    let namespace = route.toLowerCase().split('/').reverse()[1]
    let obj = require(route)
    return Object.keys(obj).forEach(version => {
      return Object.keys(obj[version]).forEach(method => {
        Object.keys(obj[version][method]).forEach(resource => {
          let controller = obj[version][method][resource]
          let declared = `${router}.${method}('/${version}/${namespace}${resource}, ${controller}')`
          return declared
        })
      })
    })
  })
}
console.log(routeBuilder(app, routePaths))
