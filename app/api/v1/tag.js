const Router = require('koa-router')
const router = new Router({ prefix: '/v1/tag' })
const {
  TagInfoValidator,
  TagModifyValidator,
  DeleteTagValidator,
} = require('../../validators/validator')
const { Tag } = require('../../models/tag')
const { success } = require('../../lib/helper')

/**
 * 展示所有标签
 */
router.get('/', async () => {
  const tags = await Tag.show()
  success('ok', tags)
})

/**
 * 新增标签接口
 */
router.post('/add', async ctx => {
  const v = await new TagInfoValidator().validate(ctx)
  const tag = {
    name: v.get('body.name')
  }
  await Tag.add(tag)
  success('ok')
})

router.post('/modify', async ctx => {
  const v = await new TagModifyValidator().validate(ctx)
  const tag = v.get('body')
  await Tag.modify(tag)
  success('ok')
})

/**
 * 删除标签接口
 */
router.get('/delete/:id', async ctx => {
  const v = await new DeleteTagValidator().validate(ctx)
  await Tag.delete(v.get('path.id'))
  success('ok')
})

module.exports = router