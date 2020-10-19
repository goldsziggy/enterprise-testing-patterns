const services = require('../services')

const postRoot = async (req, res) => {
  const { body, logger } = req
  logger.info({ body }, 'Request Received')

  try {
    const films = await services.getAllFIlms(logger)
    const film = await services.getByFilmId(films[0].id, logger)

    res.status(200).json(film)
  } catch (e) {
    logger.error('caught error')
    res.status(500).json({ error: true })
  }
}

module.exports = postRoot
