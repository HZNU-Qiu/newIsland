const Router = require('koa-router')
const router = new Router({ prefix: '/v1/library' })
const {
  PositiveIntegerValidator,
  LibraryInfoValidator,
  AddAdminValidator,
  DesignateValidator,
  BanLibraryValidator,
  ActivateLibraryValidator,
  ModifyLibraryValidator,

} = require('../../validators/validator')
const { Library } = require('../../models/library')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

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
  let data = {}
  data.count = libraries.length
  data.rows = libraries
  success('ok', data)
})

/**
 * 为题库分配管理员
 */
router.post('/designate', async ctx => {
  const v = await new AddAdminValidator().validate(ctx)
  const userId = v.get('body.userId')
  const libraryId = v.get('body.libraryId')
  await Library.designate(userId, libraryId)
  success('ok')
})

/**
 * 激活题库
 */
router.get('/activate/:id', async ctx => {
  const v = await new ActivateLibraryValidator().validate(ctx)
  const id = v.get('path.id')
  await Library.activate(id)
  success('ok')
})

/**
 * 禁用题库
 */
router.get('/ban/:id', async ctx => {
  const v = await new BanLibraryValidator().validate(ctx)
  const id = v.get('path.id')
  await Library.ban(id)
  success('ok')
})

/**
 * 编辑题库
 */
router.post('/modify',new Auth(16).m ,async ctx => {
  const v = await new ModifyLibraryValidator().validate(ctx)
  const library = v.get('body')
  await Library.modify(library)
  success('ok')
})

module.exports = router