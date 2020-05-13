const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserExercise extends Model {
  /**
   * 用户收藏错题
   * @param params 参数集
   */
  static async collect(params) {
    return await UserExercise.create({
      ...params
    })
  }

  /**
   * 分页展示用户某个题库的错题
   * 一页 10题
   * @param libraryId 题库id
   * @param userId 用户id
   * @param currentPage 当前页数
   */
  static async show(userId, libraryId, currentPage) {
    const offset = (currentPage - 1) * 10
    let sql = `
    SELECT e.* FROM exercise e LEFT JOIN user_exercise u
    ON e.id = u.exercise_id
    LEFT JOIN chapter c ON e.chapter = c.id
    WHERE c.library_id = ${libraryId} AND u.user_id = ${userId}
    LIMIT 10 OFFSET ${offset}
    `
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

}

UserExercise.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  user_id: Sequelize.INTEGER,
  // 题目id
  exercise_id: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user_exercise'
})

module.exports = { UserExercise }