const parser = require('fast-xml-parser')
const fs = require('fs')
const _ = require('lodash')
const { post } = require('axios')
const soapTemplateFile = fs.readFileSync(__dirname + '/soap-template.xml')
const soapTemplate = _.template(soapTemplateFile)

const url = 'http://currencyconverter.kowabunga.net/converter.asmx?WSDL'

const currencyConversion = (dateTime, isUSD) => {
  const xmls = soapTemplate({ dateTime: new Date(dateTime).toISOString(), isUSD })

  return post(url, xmls, {
    headers: { 'Content-Type': 'text/xml' },
  })
    .then(({ data }) => {
      const result = parser.parse(data)
      const val = _.get(
        result,
        'soap:Envelope.soap:Body.GetCurrencyRateResponse.GetCurrencyRateResult'
      )
      return val
    })
    .catch((err) => {
      const errorData = _.get(err, 'response.data', false)
      if (errorData) {
        const result = parser.parse(errorData)
        const parsedError = _.get(result, 'soap:Envelope.soap:Body.soap:Fault', false)
        if (parsedError) {
          // do something with the error
          throw new Error(`${parsedError.faultcode}: ${parsedError.faultstring}`)
        }
      }
      throw err
    })
}
module.exports = {
  currencyConversion,
}
