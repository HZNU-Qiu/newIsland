const Router = require('koa-router')
const router = new Router({ prefix: '/v1/userexam' })
const {
  UserEnrollValidator,
  AbandonExamValidator,

} = require('../../validators/validator')
const { UserExam } = require('../../models/user_exam')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 学生报名考试
 */
router.post('/enroll', new Auth(4).m, async ctx => {
  const v = await new UserEnrollValidator().validate(ctx)
  const userId = v.get('body.user_id')
  const examId = v.get('body.exam_id')
  await UserExam.enroll(userId, examId)
  success('ok')
})

/**
 * 学生弃考
 */
router.get('/abandon/:id', new Auth(4).m, async ctx => {
  const userId = ctx.auth.uid
  const v = await new AbandonExamValidator().validate(ctx, {userId: userId})
  const examId = v.get('path.id')
  await UserExam.abandon(userId, examId)
  success('ok')
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