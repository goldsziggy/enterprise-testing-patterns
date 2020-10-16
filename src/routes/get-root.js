const getRoot = (req, res) => {
  const { body, logger } = req

  logger.info('Request Received')

  res.status(200).json({ foo: 'bar' })
}

module.exports = getRoot
