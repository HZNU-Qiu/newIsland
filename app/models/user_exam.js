const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserExam extends Model {
  /**
   * 用户报名考试
   * @param userId 用户id
   * @param examId 考试id
   */
  static async enroll(userId, examId) {
    return await UserExam.create({
      user_id: userId,
      exam_id: examId
    })
  }

  /**
   * 展示用户的考试分页，一页10个
   * @param currentPage 当前页数
   * @param userId 用户id
   */
  static async listUserExams(currentPage, userId) {
    const offset = (currentPage - 1) * 10
    let sql = `
    SELECT e.id,e.name,e.start,e.end,e.status,u.grade,u.status AS hasSubmit
    FROM exam e 
    LEFT JOIN user_exam u ON e.id = u.exam_id
    WHERE u.user_id = ${userId}
    LIMIT 10 OFFSET ${offset}
    `
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
   * 用户放弃考试
   * @param userId 用户id
   * @param examId 考试id
   */
  static async abandon(userId, examId) {
    return await UserExam.destroy({
      where: {
        user_id: userId,
        exam_id: examId
      },
      force: true
    })
  }

  /**
   * 删除用户考试记录
   * @param user_id 用户id
   * @param exam_id 考试id
   */
  static async clearOne(user_id, exam_id) {
    return await UserExam.destroy({
      where: {
        user_id,
        exam_id
      },
      force: true
    })
  }

  /**
   * 删除用户考试记录
   * @param exam_id 考试id
   */
  static async clear(exam_id) {
    return await UserExam.destroy({
      where: {
        exam_id
      },
      force: true
    })
  }

  /**
   * 返回某场考试所有的考试成绩给题库管理员
   * @param exam_id 考试id
   */
  static async listGrade(exam_id) {
    let sql = `
    SELECT u.username,e.grade FROM user u 
    LEFT JOIN user_exam e ON u.id = e.user_id
    WHERE e.exam_id=${exam_id}
    `
    let grades = await db.query(sql, { raw: true })
    grades = grades[0]
    let data = {}
    data.rows = grades
    data.count = grades.length
    return data
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
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'user_exam'
})

module.exports = { UserExam }