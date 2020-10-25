const services = require("../services");
const { getUsers } = require("../ldap/ldap-calls");

const postRoot = async (req, res) => {
  const { body, logger } = req;
  logger.info({ body }, "Request Received");

  try {
    const films = await services.getAllFIlms(logger);
    const film = await services.getByFilmId(films[0].id, logger);
    const user = await getUsers("matt@zygowicz.com");
    res.status(200).json({ film, user });
  } catch (e) {
    logger.error("caught error");
    res.status(500).json({ error: true });
  }
};

module.exports = postRoot;
