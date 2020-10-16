const services = require('../services')

const postRoot = async (req, res) => {
  const { body, logger } = req
  logger.info({ body }, 'Request Received')

  const { filmId } = body
  try {
    const val = await services.genericRestCall(filmId, logger)

    console.log({ val })
    res.status(200).json({ foo: 'bar' })
  } catch (e) {
    logger.error('caught error')
    res.status(500).json({ error: true })
  }
}

module.exports = postRoot
