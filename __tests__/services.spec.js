/**
 * Service tests in general are hit-or-miss for testing purposes.  While its good to test individual functions, service calls tend to be very boilerplate (as seen below).
 *
 * In general I am more of a fan of testing the implementation case opposed to the service function itself
 *
 * I prefer using nock for mocking service requests as it closer simulates the call stack performed by axios.
 */
const nock = require('nock')
const services = require('../src/services')

describe('Services tests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })
  describe('getByFilmId ', () => {
    it('Should return the data on a successful call', async (done) => {
      const id = '123'
      const mockData = { foo: 'bar' }
      nock('https://ghibliapi.herokuapp.com').get(`/films/${id}`).reply(200, mockData)
      const data = await services.getByFilmId(id, { info: jest.fn(), error: jest.fn() })
      expect(data).toEqual(mockData)
      done()
    })
    it('Should throw an error when the service is down', async (done) => {
      const id = '123'
      nock('https://ghibliapi.herokuapp.com')
        .get(`/films/${id}`)
        .reply(500, () => {})
      try {
        await services.getByFilmId(id, { info: jest.fn(), error: jest.fn() })
        throw new Error('The service call did not throw the expected error')
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500')
      }
      done()
    })

    it('Should throw an error if the service call timesout', async (done) => {
      const id = '123'
      nock('https://ghibliapi.herokuapp.com')
        .get(`/films/${id}`)
        .delayConnection(1500)
        .reply(200, {})
      try {
        await services.getByFilmId(id, { info: jest.fn(), error: jest.fn() })
        throw new Error('The service call did not throw the expected error')
      } catch (e) {
        expect(e.message).toEqual('timeout of 1000ms exceeded')
      }
      done()
    })
  })
  describe('getAllFIlms ', () => {
    it('Should return the data on a successful call', async (done) => {
      const mockData = [{ foo: 'bar' }]
      nock('https://ghibliapi.herokuapp.com').get(`/films`).reply(200, mockData)
      const data = await services.getAllFIlms({ info: jest.fn(), error: jest.fn() })
      expect(data).toEqual(mockData)
      done()
    })
    it('Should throw an error when the service is down', async (done) => {
      nock('https://ghibliapi.herokuapp.com')
        .get(`/films`)
        .reply(500, () => {})
      try {
        await services.getAllFIlms({ info: jest.fn(), error: jest.fn() })
        throw new Error('The service call did not throw the expected error')
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500')
      }
      done()
    })

    it('Should throw an error if the service call timesout', async (done) => {
      nock('https://ghibliapi.herokuapp.com').get(`/films`).delayConnection(1500).reply(200, {})
      try {
        await services.getAllFIlms({ info: jest.fn(), error: jest.fn() })
        throw new Error('The service call did not throw the expected error')
      } catch (e) {
        expect(e.message).toEqual('timeout of 1000ms exceeded')
      }
      done()
    })
  })
})
