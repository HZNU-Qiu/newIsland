const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserExam extends Model {
  /**
   * 用户报名考试
   * @param params 参数集
   */
  static async enroll(params) {
    return await UserExam.create({
      ...params
    })
  }
}

UserExam.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  user_id: Sequelize.INTEGER,
  // 考试id
  exam_id: Sequelize.INTEGER,
  // 成绩
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'user_exam'
})

module.exports = { UserExam }