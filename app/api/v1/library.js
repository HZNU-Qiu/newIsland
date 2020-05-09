const Router = require('koa-router')
const router = new Router({ prefix: '/v1/library' })
const {
  PositiveIntegerValidator,
  LibraryInfoValidator,
  AddAdminValidator,
  DesignateValidator,
} = require('../../validators/validator')
const { Library } = require('../../models/library')
const { success } = require('../../lib/helper')

/**
 * 新增题库接口
 */
router.post('/add', async ctx => {
  const v = await new LibraryInfoValidator().validate(ctx)
  const library = v.get('body')
  await Library.add(library)
  success('ok')
})

/**
 * 显示题库信息 (分页)一页20个数据
 * @param currentPage 当前页码
 * @param tag_id 所属类型
 */
router.get('/', async ctx => {
  const { currentPage = 1, tag_id = 0 } = ctx.request.query
  let offset = (currentPage - 1) * 20
  const libraries = await Library.listByPage(offset, parseInt(tag_id))
  success('ok', libraries)
})

/**
 * 为题库分配管理员
 */
router.post('/designate', async ctx => {
  const v = await new AddAdminValidator().validate(ctx)
  const userId = v.get('body.userId')
  const libraryId = v.get('body.libraryId')
  console.log(userId, libraryId)
  await Library.designate(userId, libraryId)
  success('ok')
})

module.exports = router