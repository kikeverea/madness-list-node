module.exports = (request, response, next) => {
  console.log(`[${request.method}]`, request.path)
  if (request.body)
    console.log('Body:', request.body)

  next()
}