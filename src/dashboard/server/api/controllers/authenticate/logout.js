const config = require('config')

const activeDirectoryConfig = config.get('activeDirectory')

const OAUTH2_URL = `https://login.microsoftonline.com/${activeDirectoryConfig.tenant}/oauth2`

/** @type {import('koa').Middleware} */
module.exports = async context => {
  context.cookies.set('token')
  context.cookies.set('azure.access_token')
  context.cookies.set('azure.refresh_token')
  return context.redirect(OAUTH2_URL + '/logout')
}
