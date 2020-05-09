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