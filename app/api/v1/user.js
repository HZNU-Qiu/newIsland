const Router = require('koa-router')
const router = new Router({ prefix: '/v1/user' })
const { RegisterValidator,
  PositiveIntegerValidator,
  AccountDesignateValidator,
  UserInfoValidator,
  ResetPasswordValidator,

} = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 用户注册接口
 */
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    username: v.get('body.username'),
    account: v.get('body.account'),
    sex: v.get('body.sex'),
    type: 4,
    avatar: '/default.jpg',
    status: 1
  }
  await User.add(user)
  success()
})

/**
 * 题库管理员账号分配接口
 */
router.post('/distribute', async (ctx, next) => {
  const v = await new AccountDesignateValidator().validate(ctx)
  const user = {
    password: v.get('body.password1'),
    username: v.get('body.username'),
    account: v.get('body.account'),
    type: 16,
    avatar: '/default.jpg',
    status: 1
  }
  await User.add(user)
  success()
})

/**
 * 管理员用户分页列表接口
 */
router.get('/list', new Auth(32).m, async ctx => {
  let { currentPage = 1, type = 4, username = null, status = 1 } = ctx.request.query
  let offset = (currentPage - 1) * 15
  const userList = await User.listByPage(offset, type, username, status)
  success('ok', userList)
})

/**
 * 普通用户禁用接口
 */
router.get('/ban/:id', new Auth(32).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  await User.banUser(v.get('path.id'))
  success('ok')
})

/**
 * 用户激活接口
 */
router.get('/activate/:id', new Auth(32).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  await User.activateUser(v.get('path.id'))
  success('ok')
})

/**
 * 用户信息编辑接口
 */
router.post('/modify', async ctx => {
  const v = await new UserInfoValidator().validate(ctx)
  const info = {
    id: v.get('body.id'),
    username: v.get('body.username'),
    email: v.get('body.email'),
    sex: v.get('body.sex'),
  }
  await User.modify(info)
  return success('ok')
})

/**
 * 用户细节展示
 */
router.get('/detail', new Auth(4).m, async ctx => {
  const id = ctx.auth.uid
  const data = await User.detail(id)
  success('ok', data)
})

/**
 * 用户修改密码
 */
router.post('/reset', new Auth(4).m, async ctx => {
  const v = await new ResetPasswordValidator().validate(ctx)
  const id = ctx.auth.uid
  let param = {}
  param.id = id
  param.password = v.get('body.password1')
  await User.resetPassword(param)
  success('ok')
})

/**
 * 获取未分配题库管理员
 */
router.get('/preassign', new Auth(32).m, async ctx => {
  const data = await User.getUnassignedAdmin()
  success('ok', data)
})

module.exports = router