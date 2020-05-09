const Router = require('koa-router')
const router = new Router({ prefix: '/v1/exam' })
const {
  AddExamValidator,
  ModifyExamValidator,

} = require('../../validators/validator')
const { Exam } = require('../../models/exam')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 新增考试接口
 */
router.post('/add', async ctx => {
  const v = await new AddExamValidator().validate(ctx)
  const params = v.get('body')
  await Exam.add(params)
  success('ok')
})

/**
 * 编辑考试接口
 */
router.post('/modify', async ctx => {
  const v = await new ModifyExamValidator().validate(ctx)
  const params = v.get('body')
  await Exam.modify(params)
  success('ok')
})

/**
 * 考试列表接口
 */
router.get('/', async ctx => {
  const { library_id, status } = ctx.request.query
  const data = await Exam.listByStatus(library_id, status)
  success('ok', data)
})

module.exports = router