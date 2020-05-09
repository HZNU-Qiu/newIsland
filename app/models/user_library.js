const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserLibrary extends Model {
  /**
   * 用户获取题库
   * @param userId 用户id
   * @param library_id 题库id
   */
  static async ownLibrary(user_id, library_id) {
    const { Library } = require('./library')
    const userLibrary = await UserLibrary.findOne({
      where: {
        user_id, library_id
      }
    })
    if (userLibrary) {
      throw new Error('您已经拥有该题库了')
    }
    let library = await Library.findByPk(library_id)
    db.transaction(async t => {
      await UserLibrary.create({
        user_id, library_id
      }, {
        transaction: t
      })
      return await library.increment('member', { by: 1, transaction: t })
    })
  }

  /**
   * 列举用户的所有题库
   * @param userId 用户id
   * @param tag_id 标签编号
   * @param isfree 是否免费
   */
  static async listUserLibraries(userId, tag_id, isfree) {
    let sql = `
    SELECT l.id, l.name, l.member, l.remark, l.isfree, t.name tagName
    FROM library l LEFT JOIN tags t ON l.tag_id = t.id
    LEFT JOIN user_library u ON u.library_id = l.id
    WHERE u.user_id = ${userId} AND l.status = 1 
    `
    tag_id !== null ? sql += `AND l.tag_id = ${tag_id} ` : sql += ``
    isfree !== null ? sql += `AND l.isfree = ${isfree} ` : sql += ``
    const data = await db.query(sql, { raw: true })
    return data[0]
  }
}

UserLibrary.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  user_id: Sequelize.INTEGER,
  // 题库id
  library_id: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user_library'
})

module.exports = { UserLibrary }