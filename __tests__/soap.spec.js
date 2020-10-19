const nock = require('nock')
const parser = require('fast-xml-parser')
const lodash = require('lodash')
const { currencyConversion } = require('../src/soap')

const soapURL = 'http://currencyconverter.kowabunga.net'

const sampleSuccessResponse = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCurrencyRateResponse xmlns="http://tempuri.org/">
      <GetCurrencyRateResult>15</GetCurrencyRateResult>
    </GetCurrencyRateResponse>
  </soap:Body>
</soap:Envelope>`

const sampleErrorResponse = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><soap:Fault><faultcode>soap:Client</faultcode><faultstring>Server was unable to read request. ---&gt; There is an error in XML document (12, 18). ---&gt; The string \'1603068090810\n      \' is not a valid AllXsd value.</faultstring><detail /></soap:Fault></soap:Body></soap:Envelope>`

describe('Soap tests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })
  describe('the request XML is formatted correctly ', () => {
    it('Should set currency to US when isUSD is true', async (done) => {
      let isCurrencySetAndCorrect = false
      nock(soapURL)
        .post(`/converter.asmx?WSDL`)
        .reply(200, (uri, requestBody) => {
          const parsed = parser.parse(requestBody)
          const parsedRate = lodash.get(parsed, 'soap:Envelope.soap:Body.GetCurrencyRate')
          isCurrencySetAndCorrect = parsedRate.Currency === 'US'
        })
      await currencyConversion(Date.now(), true)
      expect(isCurrencySetAndCorrect).toEqual(true)
      done()
    })
    it('Should set currency to YEN when isUSD is false', async (done) => {
      let isCurrencySetAndCorrect = false
      nock(soapURL)
        .post(`/converter.asmx?WSDL`)
        .reply(200, (uri, requestBody) => {
          const parsed = parser.parse(requestBody)
          const parsedRate = lodash.get(parsed, 'soap:Envelope.soap:Body.GetCurrencyRate')
          isCurrencySetAndCorrect = parsedRate.Currency === 'YEN'
        })
      await currencyConversion(Date.now(), false)
      expect(isCurrencySetAndCorrect).toEqual(true)
      done()
    })
  })
  describe('function behavior', () => {
    it('Should return the currency upon success', async (done) => {
      nock(soapURL).post('/converter.asmx?WSDL').reply(200, sampleSuccessResponse)
      const val = await currencyConversion(Date.now(), false)
      expect(val).toEqual(15)
      done()
    })
    it('Should throw HTTP Error when there is no XML returned', async (done) => {
      nock(soapURL).post('/converter.asmx?WSDL').reply(500, false)
      try {
        await currencyConversion(Date.now(), false)
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500')
        return done()
      }
      done(new Error('expected the soap call to throw an error and none was recieved'))
    })
    it('Should throw the soap Error when there is XML returned', async (done) => {
      nock(soapURL).post('/converter.asmx?WSDL').reply(500, sampleErrorResponse)
      try {
        await currencyConversion(Date.now(), false)
      } catch (e) {
        expect(e.message).toEqual(expect.stringContaining('Server was unable to read request'))
        return done()
      }
      done(new Error('expected the soap call to throw an error and none was recieved'))
    })
  })
})
