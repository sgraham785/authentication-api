const originWhitelist = ['localhost', '0.0.0.0']

const origin = (origin, callback) => {
  if (originWhitelist.includes(origin)) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}

export const corsOptions = {
  origin,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-type', 'Accept', 'X-Access-Token', 'X-Key'],
  credentials: true,
  maxAge: 3600
}
