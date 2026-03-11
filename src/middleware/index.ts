import requestLogger from './requestLogger'
import unknownEndpoint from './unknownEndpoint'
import userExtractor from './userExtractor'

export default { requestLogger, unknownEndpoint, tokenExtractor: userExtractor }