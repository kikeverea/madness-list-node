export const requestLogger = (request, response, next) => {
  console.log(`[${request.method}]`, request.path)
  if (request.body)
    console.log('Body:', request.body)

  next()
}

export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}