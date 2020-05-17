const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Chapter extends Model {
  /**
   * 新增章节
   * @param chapter 章节对象
   */
  static async add(chapter) {
    return await Chapter.create({
      ...chapter
    })
  }

  /**
   * 编辑章节信息
   * @param chapter 章节对象
   */
  static async modify(chapter) {
    return await Chapter.update({
      ...chapter
    }, {
      where: {
        id: chapter.id
      }
    })
  }

  /**
   * 列出某个题库所有章节
   * @param libraryId 题库编号
   */
  static async list(libraryId) {
    const data = await Chapter.findAndCountAll({
      where: {
        library_id: libraryId
      }
    })
    return data
  }

  /**
   * 列出用户题库章节
   * @param userId 用户id
   * @param libraryId 题库id
   */
  static async listUserChapters(userId, libraryId) {
    let chapter = await db.query(`SELECT * FROM chapter WHERE library_id=${libraryId}`, { raw: true })
    chapter = chapter[0]
    let userEx = await db.query(`SELECT e.id,e.chapter
    FROM user_exercise u 
    LEFT JOIN exercise e ON u.exercise_id=e.id 
    LEFT JOIN chapter c ON e.chapter=c.id 
    WHERE c.library_id=${libraryId} AND u.user_id=${userId} AND u.type=2`, { raw: true })
    userEx = userEx[0]
    chapter.map(item => {
      item.done = 0
      userEx.map(item1 => {
        if (item1.chapter === item.id) {
          item.done++
        }
      })
    })
    return chapter
  }

}

Chapter.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 章节名称
  name: Sequelize.STRING(64),
  // 章节题目数量
  exercise_num: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 所属题库id
  library_id: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'chapter'
})

module.exports = { Chapter }