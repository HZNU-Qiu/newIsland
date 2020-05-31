const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exercise extends Model {
  /**
   * 新增题型
   * @param exercise 练习题对象
   */
  static async add(exercise) {
    let answer = exercise.answer
    answer = Array.from(answer).sort().join("")
    exercise.answer = answer.toUpperCase()
    const { Chapter } = require('./chapter')
    let chapter = await Chapter.findByPk(exercise.chapter)
    db.transaction(async t => {
      await Exercise.create({
        ...exercise
      }, {
        transaction: t
      })
      return await chapter.increment('exercise_num', { by: 1, transaction: t })
    })
  }

  /**
   * 分页展示题目 一页10题
   * @param currentPage 当前页数
   * @param chapter 章节ID
   * @param type null为全部
   * @param offset 偏移量
   */
  static async show(pageParams) {
    let exercise = null
    if (!pageParams.type) {
      exercise = await Exercise.findAndCountAll({
        where: {
          chapter: pageParams.chapter
        },
        offset: pageParams.offset,
        limit: 10
      })
    } else {
      exercise = await Exercise.findAndCountAll({
        where: {
          chapter: pageParams.chapter,
          type: pageParams.type
        },
        offset: pageParams.offset,
        limit: 10
      })
    }
    return exercise
  }

  /**
   * 用户刷题，前端分页
   * @param id 章节ID
   */
  static async doExercise(id) {
    return await Exercise.findAll({
      where: {
        chapter: id
      }
    })
  }

  /**
   * 新增题型
   * @param exercise 练习题对象
   */
  static async modify(exercise) {
    return await Exercise.update({
      ...exercise
    }, {
      where: {
        id: exercise.id
      }
    })
  }

  /**
   * 展示题库所有题目
   * @param id 题库ID
   * @param type 题目类型 null为全部题目
   * @param level 题目难度 null任意难度
   */
  static async listAll(params) {
    let chapters = await db.query(
      `SELECT id, name FROM chapter WHERE library_id = ${params.id}`
      , { raw: true })
    let idArray = []
    let list = {}
    chapters[0].map(item => {
      list[item.id] = {
        id: item.id,
        name: item.name,
        child: []
      }
      idArray.push(item.id)
    })
    let param = idArray.join(',')
    let sql = null
    if (!params.type && !params.level) {
      sql = `SELECT * FROM exercise WHERE chapter in (${param})`
    } else if (params.type && !params.level) {
      sql = `SELECT * FROM exercise WHERE chapter in (${param}) AND type=${params.type}`
    } else if (!params.type && params.level) {
      sql = `SELECT * FROM exercise WHERE chapter in (${param}) AND level=${params.level}`
    } else {
      sql = `SELECT * FROM exercise WHERE chapter in (${param})AND type=${params.type} AND level=${params.level}`
    }
    let exercise = await db.query(
      sql, { raw: true })
    exercise[0].map(item => {
      list[item.chapter].child.push(item)
    })
    return await list
  }

  /**
   * 模拟考试
   * @param paperId 试卷ID
   */
  static async simulateExam(paperId) {
    let data = {}
    const { Paper } = require('./paper')
    let paper = await Paper.findByPk(paperId)
    let sql = `
    SELECT * FROM exercise WHERE id in (${paper.problem_list})
    `
    let ex = await db.query(sql, { raw: true })
    data.rows = ex[0]
    data.grade = paper.score
    data.count = ex[0].length
    return data
  }

  /**
   * 删除题目
   * @param id 题目id
   * @param chapter_id 章节id
   */
  static async delete(id, chapter_id) {
    const { Chapter } = require('./chapter')
    let chapter = await Chapter.findByPk(chapter_id)
    db.transaction(async t => {
      await Exercise.destroy({
        where: {
          id
        },
        force: true
      }, { transaction: t })
      return await chapter.decrement('exercise_num', { by: 1, transaction: t })
    })

  }


}

Exercise.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 章节id
  chapter: Sequelize.INTEGER,
  // 题目内容
  content: Sequelize.TEXT,
  // 答案
  answer: Sequelize.STRING(16),
  // 解析
  analysis: Sequelize.TEXT,
  // 题目类型
  type: Sequelize.INTEGER,
  // 题目难度
  level: Sequelize.INTEGER,
  // 题目状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'exercise'
})

module.exports = { Exercise }