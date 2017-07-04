const originWhitelist = [
  'http://localhost:8080' // swagger-ui
]

const origin = (origin, callback) => {
  // console.log(origin)
  if (originWhitelist.includes(origin) || !origin) {
    callback(null, true)
  } else {
    callback(new Error(`${origin} is not allowed by CORS`))
  }
}

export const corsOptions = {
  origin,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-type', 'Accept', 'X-Access-Token', 'X-Key'],
  credentials: true,
  maxAge: 3600
}
