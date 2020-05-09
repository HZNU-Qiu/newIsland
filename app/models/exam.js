const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exam extends Model {
  /**
   * 新增考试
   * 开启数据库定时任务
   * @param params 参数集
   */
  static async add(params) {
    return await Exam.create({
      ...params
    })
  }

  /**
   * 编辑考试信息
   * @param params 参数集
   */
  static async modify(params) {
    return await Exam.update({
      ...params
    }, {
      where: {
        id: params.id
      }
    })
  }

  /**
   * 根据考试状态展示考试
   * @param library_id 考试编号
   * @param status 考试状态
   */
  static async listByStatus(library_id, status) {
    let sql = `
    SELECT e.* 
    FROM exam e LEFT JOIN paper p ON e.paper_id = p.id
    WHERE p.library_id = ${library_id} 
    `
    switch (status) {
      case 0:
        sql += `AND e.status = 0`
        break
      case 1:
        sql += `AND e.status = 1`
        break
      case 2:
        sql += `AND e.status = 2`
        break
      case 3:
        sql += `AND e.status = 3`
        break
      default:
        break
    }
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

}

Exam.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 考试名称
  name: Sequelize.STRING(32),
  // 开始时间
  start: Sequelize.DATE,
  // 结束时间
  end: Sequelize.DATE,
  // 考试试卷id
  paper_id: Sequelize.INTEGER,
  // 考试状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'exam'
})

module.exports = { Exam }