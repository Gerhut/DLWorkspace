const Router = require('koa-router')

const router = module.exports = new Router({
  sensitive: true,
  strict: true
})

router.param('clusterId',
  require('./middlewares/clusterIdId'))

router.all('/:clusterId/prometheus',
  require('./controllers/prometheus'))
router.all('/:clusterId/grafana',
  require('./controllers/grafana'))
