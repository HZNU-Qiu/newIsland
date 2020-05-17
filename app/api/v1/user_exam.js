const Router = require('koa-router')
const router = new Router({ prefix: '/v1/userexam' })
const {

} = require('../../validators/validator')
const { UserExam } = require('../../models/user_exam')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.post('/enroll', new Auth(4).m, async ctx => {
  
})

/**
 * 用户查询自己的考试
 */
router.get('/mine', new Auth(4).m, async ctx => {
  const id = ctx.auth.uid
  const { currentPage = 1, status } = ctx.request.query
  const data = await UserExam.listUserExams(currentPage, id, status)
  success('ok', data)
})


module.exports = router