const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Tag } = require('../models/tag')

class Library extends Model {
  /**
   * 新增题库
   * @param library 数据对象
   */
  static async add(library) {
    const tag = await Tag.findByPk(library.tag_id)
    db.transaction(async t => {
      await Library.create({
        ...library
      }, {
        transaction: t
      })
      return await tag.increment('library_num', {
        by: 1,
        transaction: t
      })
    })
  }

  /**
   * 编辑题库
   * @param library 更新数据对象 
   */
  static async modify(library) {
    return await Library.update({
      ...library
    }, {
      where: {
        id: library.id
      }
    })
  }

  /**
   * 启用题库
   * @param id 题库id
   */
  static async activate(id) {
    return await Library.update({
      status: 1
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 禁用题库
   * @param id 题库id
   */
  static async ban(id) {
    return await Library.update({
      status: 0
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 展示题库(分页) 一页20个数据
   */
  static async listByPage(offset, tagId) {
    let sql = ''
    if (!tagId) {
      sql = `
      SELECT l.*,u.username,t.name as tagName
      FROM library l LEFT JOIN user u
      ON l.admin_id = u.id
      LEFT JOIN tags t
      ON l.tag_id = t.id
      LIMIT 20 OFFSET ${offset}
      `
    } else {
      sql = `
      SELECT l.*,u.username,t.name as tagName
      FROM library l LEFT JOIN user u
      ON l.admin_id = u.id
      LEFT JOIN tags t
      ON l.tag_id = t.id
      WHERE l.tag_id = ${tagId}
      LIMIT 20 OFFSET ${offset}
      `
    }
    let libraries = await db.query(sql, { raw: true })
    return libraries[0]
  }

  /**
   * 给题库分配管理员
   * @param userId 题库管理员ID
   * @param libraryId 题库ID
   */
  static async designate(userId, libraryId) {
    return await Library.update({
      admin_id: userId
    }, {
      where: {
        id: libraryId
      }
    })
  }
}

Library.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 题库名称
  name: Sequelize.STRING(64),
  // 题库标签，所属大类
  tag_id: Sequelize.INTEGER,
  // 题库成员数量
  member: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 题库状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 管理员id
  admin_id: Sequelize.INTEGER,
  // 备注字段
  remark: Sequelize.STRING(256),
  // 是否收费
  isfree: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
}, {
  sequelize: db,
  tableName: 'library'
})

module.exports = { Library }