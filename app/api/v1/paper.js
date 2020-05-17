const Router = require('koa-router')
const router = new Router({ prefix: '/v1/paper' })
const {
  QueryPaperValidator,
  AddPaperModelValidator,
  AssemblePaperValidator,
  PositiveIntegerValidator,

} = require('../../validators/validator')
const { Paper } = require('../../models/paper')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 分页展示试卷库 一页20条记录
 */
router.post('/', new Auth(16).m, async ctx => {
  const v = await new QueryPaperValidator().validate(ctx)
  const params = v.get('body')
  let data = {}
  data.rows = await Paper.listByPage(params)
  data.count = data.rows.length
  success('ok', data)
})

/**
 * 新增试卷模板
 * 试卷名+所属题库+类型
 */
router.post('/add', async ctx => {
  const v = await new AddPaperModelValidator().validate(ctx)
  const params = v.get('body')
  await Paper.addPaperModel(params)
  success('ok')
})

/**
 * 组卷(编辑试卷除题库编号所有属性)
 */
router.post('/assemble', async ctx => {
  const v = await new AssemblePaperValidator().validate(ctx)
  const params = v.get('body')
  await Paper.assemble(params)
  success('ok')
})

/**
 * 展示试卷详情
 */
router.get('/detail/:id', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('path.id')
  const data = await Paper.detail(id)
  success('ok', data)
})

/**
 * 展示某题库所有试卷id、名称(根据试卷类型)
 */
router.get('/list', async ctx => {
  const { library_id = null, type = null } = ctx.request.query
  const data = await Paper.listByType(library_id, type)
  success('ok', data)
})


module.exports = router