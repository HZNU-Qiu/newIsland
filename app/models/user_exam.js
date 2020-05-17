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

  /**
   * 展示用户的考试分页，一页10个
   * @param currentPage 当前页数
   * @param userId 用户id
   * @param status 考试状态
   */
  static async listUserExams(currentPage, userId, status) {
    const offset = (currentPage - 1) * 10
    if (parseInt(status) !== 3)
      status = 0
    let sql = `
    SELECT e.id,e.name,e.start,e.end,e.status,u.grade 
    FROM exam e 
    LEFT JOIN user_exam u ON e.id = u.exam_id
    WHERE u.user_id = ${userId} AND e.status = ${status}
    LIMIT 10 OFFSET ${offset}
    `
    const data = await db.query(sql, { raw: true })
    return data[0]
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