const { HttpError } = require('koa')
const fetch = require('node-fetch').default

/**
 * @typedef {Object} State
 * @property {import('../../services/cluster')} cluster
 */

/** @type {import('koa').Middleware<State>} */
module.exports = async context => {
  const { grafana } = context.state.cluster.config
  const { url } = context.params
  const targetUrl = new URL(url, grafana)
  targetUrl.search = context.search

  try {
    const response = await fetch(targetUrl, {
      method: context.method,
      headers: context.headers,
      body: context.req,
      redirect: 'manual'
    })
    context.status = response.status
    context.message = response.statusText
    context.
    response.headers
  } catch (error) {
    error.status = 502
    throw error
  }

  context.body = {
    'will-proxy': targetUrl
  }
}
