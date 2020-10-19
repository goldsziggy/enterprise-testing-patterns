/**
 * This test file shows how you can leverage Jest mocks to properly mock out a mysql connection.
 */
const { getUsers } = require('../src/ldap/ldap-calls')
const mockLdap = require('../src/ldap/client')

jest.mock('../src/ldap/client', () => {
  return {
    bind: jest.fn(),
    unbind: jest.fn(),
    search: jest.fn(),
  }
})

describe('ldap tests', () => {
  // clean up mocks
  afterEach(() => {
    mockLdap.search.mockReset()
    mockLdap.bind.mockReset()
    mockLdap.unbind.mockReset()
  })

  it('When LDAP fails should throw the exception up, and call unbind', async (done) => {
    mockLdap.search.mockImplementation(() => {
      // place your mock data here for testing more complex returns!
      throw new Error('just a test')
    })
    try {
      await getUsers('foo')
      done(new Error('Expected this to throw an error'))
    } catch (e) {
      expect(mockLdap.bind).toHaveBeenCalled()
      expect(mockLdap.search).toHaveBeenCalled()
      expect(mockLdap.unbind).toHaveBeenCalled()
      expect(e.message).toEqual('just a test')
    }
    done()
  })

  it('When LDAP succeeds should return the searchEntries, and call unbind', async (done) => {
    mockLdap.search.mockImplementation(() => {
      // place your mock data here for testing more complex returns!
      return { searchEntries: 'matt@zygowicz.com' }
    })
    try {
      const user = await getUsers('foo')
      expect(user).toEqual('matt@zygowicz.com')
      expect(mockLdap.bind).toHaveBeenCalled()
      expect(mockLdap.search).toHaveBeenCalled()
      expect(mockLdap.unbind).toHaveBeenCalled()
    } catch (e) {
      done(e)
    }
    done()
  })
})
