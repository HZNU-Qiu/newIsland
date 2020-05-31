const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Paper extends Model {
  /**
   * 分页展示 一页20个试卷记录
   * @param currentPage 当前页码
   * @param user_id 用户id
   */
  static async listByPage(currentPage, user_id) {
    let offset = (currentPage - 1) * 20
    let sql = `
    SELECT p.id,p.name,p.score,p.status,p.library_id,p.type 
    FROM paper p 
    JOIN library l ON l.id=p.library_id
    WHERE admin_id = ${user_id} 
    LIMIT 20 OFFSET ${offset}`
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
   * 新增试卷模板
   * @param params 参数集
   */
  static async addPaperModel(params) {
    return await Paper.create({
      ...params
    })
  }

  /**
   * 组卷
   * @param params 参数集
   */
  static async assemble(params) {
    return await Paper.update({
      ...params
    }, {
      where: {
        id: params.id
      }
    })
  }

  /**
   * 展示试卷详情信息
   * @param id 试卷id
   */
  static async detail(id) {
    const paper = await Paper.findByPk(id)
    const problemStr = paper.problem_list
    let data = {
      info: paper,
      exercises: []
    }
    let list = await db.query(
      `SELECT * FROM exercise WHERE id in (${problemStr})`
    )
    data.exercises = list[0]
    return await data
  }

  /**
   * 根据试卷类型展示所有试卷的id和名称 供组织考试使用
   * @param library_id 题库id
   * @param type 类型
   */
  static async listByType(library_id, type) {
    const data = await Paper.findAll({
      attributes: ['id', 'name'],
      where: {
        library_id: library_id,
        status: 1,
        type: type
      }
    })
    return data
  }

  /**
   * 禁用试卷
   * @param id 试卷id
   */
  static async ban(id) {
    return await Paper.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 启用试卷
   * @param id 试卷id
   */
  static async activate(id) {
    return await Paper.update({
      status: 1
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 禁用试卷
   * @param id 试卷id
   */
  static async delete(vals) {
    return await Paper.destroy({
      where: {
        id,
        status: 0
      }, 
      force: true
    })
  }

}

Paper.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 试卷名称
  name: Sequelize.STRING,
  // 试卷分数
  score: Sequelize.INTEGER,
  // 题目集合
  problem_list: Sequelize.STRING,
  // 试卷状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 所属题库
  library_id: Sequelize.INTEGER,
  // 试卷类别
  type: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
}, {
  sequelize: db,
  tableName: 'paper'
})

module.exports = { Paper }