const config = require('config')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

const User = require('../../services/user')

const activeDirectoryConfig = config.get('activeDirectory')

const OAUTH2_URL = `https://login.microsoftonline.com/${activeDirectoryConfig.tenant}/oauth2`

/**
 * @param {import('koa').Context} context
 * @return {string}
 */
const getUriWithoutQuery = context => {
  const originalUrl = context.req.originalUrl || context.request.originalUrl
  return (context.origin + originalUrl).split('?')[0]
}

/**
 * @param {import('koa').Context} context
 * @return {string}
 */
const getAuthenticationUrl = context => {
  const params = new URLSearchParams({
    client_id: activeDirectoryConfig.clientId,
    response_type: 'code',
    redirect_uri: getUriWithoutQuery(context),
    response_mode: 'query',
    scope: 'openid profile email https://api.loganalytics.io/.default',
    state: context.querystring
  })
  return OAUTH2_URL + '/authorize?' + params
}

/**
 * @param {import('koa').Context} context
 * @return {Promise}
 */
const getTokens = async context => {
  const { code } = context.query
  const params = new URLSearchParams({
    client_id: activeDirectoryConfig.clientId,
    scope: 'openid profile email',
    code,
    redirect_uri: getUriWithoutQuery(context),
    grant_type: 'authorization_code',
    client_secret: activeDirectoryConfig.clientSecret
  })
  context.log.info({ body: params.toString() }, 'Id Token request')
  const response = await fetch(OAUTH2_URL + '/token', {
    method: 'POST',
    body: params
  })
  const data = await response.json()
  context.log.info({ data }, 'Id Token response')

  context.assert(data['error'] == null, 502, data['error'])

  return {
    accessToken: data['access_token'],
    refreshToken: data['refresh_token'],
    idToken: jwt.decode(data['id_token'])
  }
}

/** @type {import('koa').Middleware} */
module.exports = async context => {
  if (context.query.code != null) {
    context.log.info({ query: context.query }, 'Authentication succeessful callback')
    const { accessToken, refreshToken, idToken } = await getTokens(context)
    context.log.info(idToken, 'Id token')

    const user = User.fromIdToken(context, idToken)

    context.cookies.set('token', user.toCookieToken())
    context.cookies.set('azure.access_token', accessToken)
    context.cookies.set('azure.refresh_token', refreshToken)

    try {
      const stateParams = new URLSearchParams(context.query.state)
      if (stateParams.has('to')) {
        return context.redirect(stateParams.get('to'))
      }
    } finally {}
    return context.redirect('/')
  } else if (context.query.error != null) {
    context.log.error({ query: context.query }, 'Authentication failed callback')
    return context.redirect('/')
  } else {
    return context.redirect(getAuthenticationUrl(context))
  }
}
