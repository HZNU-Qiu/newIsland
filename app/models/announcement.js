const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Announcement extends Model {

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