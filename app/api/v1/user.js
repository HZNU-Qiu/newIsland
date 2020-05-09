const Router = require('koa-router')
const router = new Router({ prefix: '/v1/user' })
const { RegisterValidator,
  PositiveIntegerValidator,
  AccountDesignateValidator,
  UserInfoValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')

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
  await User. add(user)
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
 * 用户分页列表接口
 */
router.get('/list', async ctx => {
  let { currentPage = 1, type = 4 } = ctx.request.query
  let offset = (currentPage - 1) * 15
  const userList = await User.listByPage(offset, type)
  success('ok', userList)
})

/**
 * 普通用户禁用接口
 */
router.get('/ban/:id', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  await User.banUser(v.get('path.id'))
  success('ok')
})

/**
 * 用户信息编辑接口
 */
router.post('/modify', async ctx => {
  const v = await new UserInfoValidator().validate(ctx)
  const info = {
    id: v.get('body.id'),
    email: v.get('body.email'),
    sex: v.get('body.sex'),
  }
  await User.modify(info)
  return success('ok')
})

module.exports = router