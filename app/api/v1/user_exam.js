const Router = require('koa-router')
const router = new Router({ prefix: '/v1/userexam' })
const {

} = require('../../validators/validator')
const { UserExam } = require('../../models/user_exam')
const { Success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.post('/enroll', new Auth(4).m, async ctx => {
  
})

module.exports = router