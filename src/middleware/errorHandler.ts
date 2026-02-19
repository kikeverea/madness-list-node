import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)

  if (err?.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.message })
  }
  if (err?.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({ error: 'internal server error' })
};
