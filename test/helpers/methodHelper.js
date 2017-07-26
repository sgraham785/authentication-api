import fetch from 'node-fetch'
import https from 'https'
import hostUrl from '../helpers/hostUrl'

const agent = new https.Agent({
  rejectUnauthorized: false
})

export const get = (route) => {
  return fetch(`${hostUrl()}${route}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/html',
      'Content-Type': 'application/json'
    },
    agent
  })
}

export const post = (route, obj) => {
  return fetch(`${hostUrl()}${route}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    agent,
    body: JSON.stringify(obj)
  })
}
