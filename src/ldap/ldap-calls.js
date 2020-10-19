const ldap = require('./client')

const bindDN = 'uid=tony.stark,ou=Users,o=5be4c382c583e54de6a3ff52,dc=jumpcloud,dc=com'
const password = 'MyRedSuitKeepsMeWarm'

const getUsers = async (filterEmail) => {
  const searchDN = 'ou=Users,o=5be4c382c583e54de6a3ff52,dc=jumpcloud,dc=com'
  try {
    await ldap.bind(bindDN, password)

    const { searchEntries } = await ldap.search(searchDN, {
      scope: 'sub',
      filter: `(mail=${filterEmail})`,
    })
    return searchEntries
  } catch (ex) {
    throw ex
  } finally {
    await ldap.unbind()
  }
}

module.exports = { getUsers }
