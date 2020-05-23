const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { ExerciseScore } = require('../lib/enum')

class Record extends Model {
  /**
   * 保存用户作答记录
   * @param params 参数集
   */
  static async preserve(params) {
    const { user_id, exam_id, problem_id, user_answer } = params
    let record = await Record.findOne({
      where: {
        user_id,
        exam_id,
        problem_id
      }
    })
    if (!record) {
      return await Record.create({
        ...params
      })
    } else {
      return await Record.update({
        user_answer
      }, {
        where: {
          user_id,
          exam_id,
          problem_id
        }
      })
    }
  }

  /**
   * 开始考试/恢复答题
   * @param user_id 用户id
   * @param exam_id 考试id
   */
  static async show(user_id, exam_id) {
    let sql1 = `
    SELECT problem_list FROM paper p 
    JOIN exam e ON e.paper_id=p.id
    WHERE e.id=${exam_id}
    `
    let problems = await db.query(sql1, { raw: true })
    problems = problems[0][0].problem_list
    let sql2 = `
    SELECT id,content,type FROM exercise
    WHERE id in (${problems})
    `
    let data = {}
    let exercises = await db.query(sql2, { raw: true })
    data.rows = exercises[0]
    data.count = exercises[0].length
    let userRecord = await Record.findAll({
      attributes: [['problem_id', 'id'], 'user_answer'],
      where: {
        user_id,
        exam_id
      }
    })
    data.record = userRecord
    return data
  }

  /**
   * 批改试卷
   * @param exam_id 考试id
   */
  static async judge(exam_id) {
    let sql0 = `
    SELECT user_id,problem_id,user_answer
    FROM record WHERE exam_id=${exam_id}
    `
    let record = await db.query(sql0, { raw: true })
    record = record[0]
    let sql1 = `
    SELECT problem_list FROM paper p 
    JOIN exam e ON e.paper_id=p.id
    WHERE e.id=${exam_id}
    `
    let problems = await db.query(sql1, { raw: true })
    problems = problems[0][0].problem_list
    let sql2 = `
    SELECT id,answer,type FROM exercise
    WHERE id in (${problems})
    `
    let exercises = await db.query(sql2, { raw: true })
    exercises = exercises[0]
    let baseline = {}
    exercises.map(item => {
      baseline[item.id] = { answer: item.answer, type: item.type }
    })
    let users = {}
    record.map(item => {
      let score = 0
      switch (baseline[item.problem_id].type) {
        case 1:
          score = ExerciseScore.SINGLECHOICE
          break
        case 2:
          score = ExerciseScore.MULTIPLECHOICE
          break
        case 3:
          score = ExerciseScore.JUDGE
          break
        default:
          break
      }
      if (item.user_answer === baseline[item.problem_id].answer) {
        if (!users.hasOwnProperty(item.user_id)) {
          users[item.user_id] = score
        } else {
          users[item.user_id] += score
        }
      }
    })
    const { UserExam } = require('./user_exam')
    const { Exam } = require('./exam')
    let funcArr = []
    for (const key in users) {
      funcArr.push(UserExam.update({
        grade: users[key]
      }, {
        where: {
          user_id: key,
          exam_id: exam_id
        }
      }))
    }
    let promise = Promise.all(funcArr)
    return promise.then(() => {
      Exam.update({
        status: 3
      }, {
        where: {
          id: exam_id
        }
      })
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