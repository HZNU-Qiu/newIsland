const Router = require('koa-router')
const router = new Router({ prefix: '/v1/userlibrary' })
const {
  IsLibraryExistValidator,
  IsLibraryAccessibleValidator
} = require('../../validators/validator')
const { UserLibrary } = require('../../models/user_library')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 用户拥有一个题库
 */
router.get('/own/:id', new Auth(4).m, async ctx => {
  const v = await new IsLibraryAccessibleValidator().validate(ctx)
  const userId = ctx.auth.uid
  await UserLibrary.ownLibrary(userId, v.get('path.id'))
  success('ok')
})

/**
 * 列出用户拥有的所有题库
 */
router.get('/', new Auth(4).m, async ctx => {
  const { tag_id = null, isfree = null } = ctx.request.query
  const userId = ctx.auth.uid
  const data = await UserLibrary.listUserLibraries(userId, tag_id, isfree)
  success('ok', data)
})


module.exports = router