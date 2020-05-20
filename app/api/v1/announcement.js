const Router = require('koa-router')
const router = new Router({ prefix: '/v1/announcement' })
const { Announcement } = require('../../models/announcement')
const { AnnouncementNotnullValidator, ModifyAnnouncementValidator, SendAnnouncementValidator, DeleteAnnouncementValidator, AdminShowAnnouncementValidator, UserShowAnnouncementValidator, } = require('../../validators/validator')
const { success } = require('../../lib/helper')
    /*
        新增通知接口
    */
router.post('/admin/add', async(ctx) => {
    const v = await new AnnouncementNotnullValidator().validate(ctx)
    const announcement = {
        content: v.get('body.content'),
        from: v.get('body.from'),
        to: v.get('body.to'),
    }
    await Announcement.add(announcement)
    success('ok')
})


/*
发送通知接口
*/
router.get('/admin/send', async(ctx) => {
    const v = await new SendAnnouncementValidator().validate(ctx)
    const vals = {
        id: v.get('body.id')
    }
    await Announcement.send(vals)
    success('ok')
})



/*
    编辑通知接口
*/

router.post('/admin/modify', async(ctx) => {
    const v = await new ModifyAnnouncementValidator().validate(ctx)
    const vals = {
        id: v.get("body.id"),
        content: v.get('body.content'),
        from: v.get('body.from'),
        to: v.get('body.to'),
    }
    await Announcement.modify(vals)
    success('ok')
})

/*
    删除通知接口
*/

router.post('/admin/delete', async(ctx) => {
    const v = await new DeleteAnnouncementValidator().validate(ctx)
    const vals = {
        id: v.get("body.id")
    }
    await Announcement.delete(vals)
    success('ok')
})

router.post('/user/delete', async(ctx) => {
    const v = await new DeleteAnnouncementValidator().validate(ctx)
    const vals = {
        id: v.get("body.id")
    }
    await Announcement.delete(vals)
    success('ok')
})


/*
通知展示接口
*/
router.get('/admin', async(ctx) => {
    const v = await new AdminShowAnnouncementValidator().validate(ctx)
    const vals = ctx.request.body
    exercise = await Announcement.AdminShow(vals)
    success('ok', exercise)
})

router.get('/user', async(ctx) => {
    const v = await new UserShowAnnouncementValidator().validate(ctx)
    const vals = ctx.request.body
    exercise = await Announcement.UserShow(vals)
    success('ok', exercise)
})


module.exports = router