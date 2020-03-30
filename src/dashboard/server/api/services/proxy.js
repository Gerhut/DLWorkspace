const fetch = require('node-fetch').default

const Service = require('./service')

class ProxyService extends Service {
  constructor (context, baseUrl) {
    super(context)
    this.baseUrl = baseUrl
  }

  async fetch (url) {
    try {
      const targetUrl = new URL(url, this.baseUrl)
      const response = await
    } catch (error) {
      this.context.log.error({ error }, 'Proxy error')
      this.context.throw(502)
    }
  }
}

module.exports = ProxyService
