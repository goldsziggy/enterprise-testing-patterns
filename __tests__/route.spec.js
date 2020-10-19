/**
 * In my route specific testing, I will be calling my express app, which will inturn call my service tests.
 *
 * That means I can get a simulated end-to-end test here.
 *
 * I prefer using nock for mocking service requests as it closer simulates the call stack performed by axios.
 */
const nock = require('nock')
const request = require('supertest')
const app = require('../src/app')

describe('post-root tests', () => {
  it('should call getAllFilms, taking the first result and passing it to getFilmById', (done) => {
    const mockItem = { id: '321' }
    nock('https://ghibliapi.herokuapp.com')
      .get(`/films`)
      .reply(200, [mockItem, { id: '123' }])
    nock('https://ghibliapi.herokuapp.com').get(`/films/${mockItem.id}`).reply(200, mockItem)
    request(app)
      .get('/enterprise-testing-patterns')
      .expect(200)
      .end((err) => {
        if (err) {
          done(err)
        }
        done()
      })
  })
})
