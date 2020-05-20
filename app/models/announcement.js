const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Announcement extends Model {
    /**
       新增通知
        @param params 参数集
       */
    static async add(params) {
        return await Announcement.create({
            ...params
        })
    }

    /**
     * 发送通知
     * @param params 参数集
     */
    static async send(params) {
        return await Announcement.update({
            status: 1
        }, {
            where: {
                id: params.id
            }
        })
    }


    /**
     * 编辑通知信息
     * @param params 参数集
     */
    static async modify(params) {
        return await Announcement.update({
            ...params
        }, {
            where: {
                id: params.id
            }
        })
    }


    /**
     * 删除通知信息
     * @param params 参数集
     */
    static async delete(params) {
        return await Announcement.destroy({
            where: {
                id: params.id
            }
        })
    }

    /**
     * 展示通知信息
     * @param params 参数集
     */
    static async AdminShow(params) {
        return await Announcement.findAndCountAll({
            where: {
                from: params.from
            },
        })
    }

    static async UserShow(params) {
        return await Announcement.findAndCountAll({
            where: {
                to: params.to,
                status: 1
            },
        })
    }

}

Announcement.init({
    // 记录id
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 通知内容
    content: Sequelize.TEXT,
    // 发件人
    from: Sequelize.INTEGER,
    // 收件人
    to: Sequelize.INTEGER,
    // 通知状态
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize: db,
    tableName: 'announcement'
})

module.exports = { Announcement }