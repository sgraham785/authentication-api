import fetch from 'node-fetch'
import https from 'https'

import hostUrl from '../util/hostUrl'

const agent = new https.Agent({
  rejectUnauthorized: false
})

export default (route, obj) => {
  console.log(hostUrl())
  return fetch(`https://0.0.0.0:8443${route}`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      rejectUnauthorized: false
    },
    agent,
    body: JSON.stringify(obj)
  })
}
