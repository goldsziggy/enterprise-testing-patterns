const { Client } = require('ldapts')

const url = 'ldaps://ldap.jumpcloud.com'

const client = new Client({
  url,
})

return client
