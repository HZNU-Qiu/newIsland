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
    WHERE c.library_id = ${libraryId} AND u.user_id = ${userId} AND u.type = 1
    LIMIT 10 OFFSET ${offset}
    `
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
   * 移除错题集中练习题
   * @param userId 用户id
   * @param exerciseId 练习题id
   */
  static async desert(userId, exerciseId) {
    return UserExercise.destroy({
      where: {
        user_id: userId,
        exercise_id: exerciseId,
        type: 1
      }, force: true
    })
  }

  /**
   * 保存已作答记录
   * @param list 题目数组
   * @param userId 用户id
   */
  static async saveRecord(list, userId) {
    let has = await UserExercise.findAll({
      where: {
        user_id: userId,
        type: 2
      }
    })

    let data = []
    var flag = 1
    list.map(item => {
      has.map(item1 => {
        if (item === item1.exercise_id) {
          flag = 0
          return
        }
      })
      if (flag) {
        data.push({ exercise_id: item, user_id: userId, type: 2 })
      }
      flag = 1
    })
    return await UserExercise.bulkCreate(data, { returning: true })
  }

  /**
   * 分页展示用户历史刷题记录
   * @param userId 用户id
   * @param libraryId 题库id
   * @param currentPage 当前页码
   */
  static async history(userId, libraryId, currentPage) {
    let offset = (currentPage - 1) * 10
    const exs = await db.query(`SELECT e.* FROM exercise e 
    LEFT JOIN user_exercise u ON e.id=u.exercise_id
    LEFT JOIN chapter c ON c.id = e.chapter
    WHERE u.user_id=${userId} AND c.library_id=${libraryId}
    LIMIT 10 OFFSET ${offset}`, { raw: true })
    let data = {}
    data.rows = exs[0]
    data.count = exs[0].length
    return data
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
  exercise_id: Sequelize.INTEGER,
  // 类型 1-收藏 2-刷题记录(已做)
  type: {
    type: Sequelize.INTEGER,
    defaultValue: 2
  }
}, {
  sequelize: db,
  tableName: 'user_exercise'
})

module.exports = { UserExercise }