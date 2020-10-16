const { querySomething } = require('../src/mysql/sql')
const mockPool = require('../src/mysql/connection')

jest.mock('../src/mysql/connection', () => {
  return {
    query: jest.fn(),
  }
})

describe('Mysql tests', () => {
  afterEach(() => {
    mockPool.query.mockReset()
  })

  it('Should run the query from inputOne', async (done) => {
    mockPool.query.mockImplementation((sql) => {
      // place your mock data here for testing more complex returns!
      return [1, 2]
    })

    await querySomething(true)

    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM inputOne WHERE 1=1')
    done()
  })
  it('Should run the query from inputTwo', async (done) => {
    mockPool.query.mockImplementation((sql) => {
      // place your mock data here for testing more complex returns!
      return [1, 2]
    })

    await querySomething(false, 'blah')

    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM inputTwo WHERE 1=?', ['blah'])
    done()
  })
})
