const Router = require('koa-router')
const router = new Router({ prefix: '/v1/record' })
const {

} = require('../../validators/validator')
const { Record } = require('../../models/record')
const { Success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.post('/preserve', new Auth(4).m, async ctx => {
  
})

module.exports = router