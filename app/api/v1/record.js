const Router = require('koa-router')
const router = new Router({ prefix: '/v1/record' })
const {
  RecordPreserveValidator,
  StartToExamValidator,
  JudgeValidator,
  
} = require('../../validators/validator')
const { Record } = require('../../models/record')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 保存用户答题记录
 */
router.post('/preserve', new Auth(4).m, async ctx => {
  const userId = ctx.auth.uid
  const v = await new RecordPreserveValidator().validate(ctx)
  let param = v.get('body')
  param.user_id = userId
  await Record.preserve(param)
  success('ok')
})

/**
 * 开始考试 / 恢复作答记录
 */
router.get('/start/:id', new Auth(4).m, async ctx => {
  const user_id = ctx.auth.uid
  const v = await new StartToExamValidator().validate(ctx)
  const exam_id = v.get('path.id')
  const data = await Record.show(user_id, exam_id)
  success('ok', data)
})

/**
 * 批改试卷
 */
router.get('/judge/:id', new Auth(16).m, async ctx => {
  const v = await new JudgeValidator().validate(ctx)
  const exam_id = v.get('path.id')
  await Record.judge(exam_id)
  success('ok')
})

module.exports = router