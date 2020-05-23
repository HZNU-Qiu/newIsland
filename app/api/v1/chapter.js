const Router = require('koa-router')
const router = new Router({ prefix: '/v1/chapter' })
const { PositiveIntegerValidator,
  AddChapterValidator } = require('../../validators/validator')
const { Chapter } = require('../../models/chapter')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

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
router.get('/list/:id', async ctx => {
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

/**
 * 用户查看进入题库返回章节
 */
router.get('/enter/:id', new Auth(4).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const userId = ctx.auth.uid
  const libraryId = v.get('path.id')
  const data = await Chapter.listUserChapters(userId, libraryId)
  success('ok', data)
})

/**
 * 管理员管理章节
 */
router.get('/regulate', new Auth(16).m, async ctx => {
  const admin_id = ctx.auth.uid
  const data = await Chapter.listByadmin(admin_id)
  success('ok', data)
})

module.exports = router