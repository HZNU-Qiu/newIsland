const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Record extends Model {
  /**
   * 保存用户作答记录
   * @param params 参数集
   */
  static async preserve(params) {
    return await Record.create({
      ...params
    })
  }
}

Record.init({
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
  // 题目id
  problem_id: Sequelize.INTEGER,
  // 用户答案
  user_answer: Sequelize.STRING(16),
  // 分数
  score: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'record'
})

module.exports = { Record }