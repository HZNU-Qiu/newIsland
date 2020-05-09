const Router = require('koa-router')
const router = new Router({ prefix: '/v1/chapter' })
const { PositiveIntegerValidator,
  AddChapterValidator } = require('../../validators/validator')
const { Chapter } = require('../../models/chapter')
const { success } = require('../../lib/helper')

/**
 * 新增章节接口
 */
router.post('/add', async ctx => {
  const v = await new AddChapterValidator().validate(ctx)
  const chapter = v.get('body')
  await Chapter.add(chapter)
  success('ok')
})

/**
 * 编辑章节接口
 */
router.post('/modify', async ctx => {
  const v = await new AddChapterValidator().validate(ctx)
  const chapter = v.get('body')
  await Chapter.modify(chapter)
  success('ok')
})

/**
 * 显示题库的所有章节
 */
router.get('/:id', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const libraryId = v.get('path.id')
  const chapterList = await Chapter.list(libraryId)
  success('ok', chapterList)
})

/**
 * 删除章节
 */
router.get('/destroy/:id', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  
})

module.exports = router