const Router = require('koa-router')
const router = new Router({ prefix: '/v1/userexercise' })
const {
  PositiveIntegerValidator,
  ExerciseExistenceValidator,

} = require('../../validators/validator')
const { UserExercise } = require('../../models/user_exercise')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.get('/collect/:id', new Auth(4).m, async ctx => {
  const v = await new ExerciseExistenceValidator().validate(ctx)
  let params = {}
  params.user_id = ctx.auth.uid
  params.exercise_id = v.get('path.id')
  await UserExercise.collect(params)
  success('ok')
})

router.get('/', new Auth(4).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const { id, currentPage = 1 } = ctx.request.query
  const userId = ctx.auth.uid
  const data = await UserExercise.show(userId, id, currentPage)
  success('ok', data)
})

router.get('/delete/:id', new Auth(4).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const userId = ctx.auth.uid
  const exerciseId = v.get('path.id')
  await UserExercise.desert(userId, exerciseId)
  success('ok')
})

module.exports = router