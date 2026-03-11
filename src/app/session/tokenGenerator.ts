import crypto from 'crypto'

const generate = () => {
  return crypto.randomBytes(32).toString('base64url')
}

export default { generate}