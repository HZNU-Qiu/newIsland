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
   * @param user_id 用户id
   */
  static async listByStatus(library_id, status, user_id = 0) {
    let sql = `
    SELECT e.id,e.name,e.start,e.end,e.status,e.paper_id 
    FROM exam e LEFT JOIN paper p ON e.paper_id = p.id
    WHERE p.library_id = ${library_id} 
    `
    switch (parseInt(status)) {
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
    let data = await db.query(sql, { raw: true })
    data = data[0]
    if (user_id) {
      let userexam = await db.query(`SELECT exam_id FROM user_exam WHERE user_id=${user_id}`, { raw: true })
      userexam = userexam[0]
      data.map(item1 => {
        item1.has = 0
        userexam.map(item2 => {
          if (item1.id === item2.exam_id) {
            item1.has = 1
          }
        })
      })
    }
    return data
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