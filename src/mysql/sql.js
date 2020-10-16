const { query } = require('./connection')

/**
 * Show branching logic based on params, query changes as input changes
 */
const querySomething = async (inputOne, inputTwo) => {
  if (inputOne === true) {
    const [rows, fields] = await query('SELECT * FROM inputOne WHERE 1=1')
    return [rows, fields]
  }
  const [rows, fields] = await query('SELECT * FROM inputTwo WHERE 1=?', [inputTwo])
  return [rows, fields]
}

module.exports = {
  querySomething,
}
