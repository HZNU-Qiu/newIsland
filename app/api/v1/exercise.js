const Router = require('koa-router')
const router = new Router({ prefix: '/v1/exercise' })
const {
  AddExerciseValidator,
  PositiveIntegerValidator,
  ModifyExerciseValidator,
  IsLibraryExistValidator
} = require('../../validators/validator')
const { Exercise } = require('../../models/exercise')
const { success } = require('../../lib/helper')

/**
 * 新增习题
 */
router.post('/add', async ctx => {
  const v = await new AddExerciseValidator().validate(ctx)
  const exercise = v.get('body')
  await Exercise.add(exercise)
  success('ok')
})

/**
 * 向题库管理员展示章节内的习题(分页)默认一页10题
 */
router.post('/', async ctx => {
  let pageParams = ctx.request.body
  let offset = (pageParams.currentPage - 1) * 10
  pageParams.offset = offset
  const list = await Exercise.show(pageParams)
  success('ok', list)
})

/**
 * 用户刷题
 */
router.get('/list/:id', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const chapter = v.get('path.id')
  const list = await Exercise.doExercise(chapter)
  success('ok', list)
})

/**
 * 编辑题目
 */
router.post('/modify', async ctx => {
  const v = await new ModifyExerciseValidator().validate(ctx)
  const exercise = v.get('body')
  await Exercise.modify(exercise)
  success('ok')
})

/**
 * 展示题库所有题目 章节>题目 供组卷使用
 * 默认全部，可通过类型、难度进行筛选
 */
router.post('/listAll', async ctx => {
  const v = await new IsLibraryExistValidator().validate(ctx)
  const params = v.get('body')
  const data = await Exercise.listAll(params)
  success('ok', data)
})

module.exports = router