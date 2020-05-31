const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const bcryptjs = require('bcryptjs')
const { Forbidden } = require('../../middlewares/exception')

class User extends Model {
  /**
   * 用户新增
   * @param user 新用户对象
   */
  static async add(user) {
    return await User.create({
      ...user
    })
  }

  /**
   * 用户账号密码登录
   */
  static async signIn(account, password) {
    let user = await User.findOne({
      where: { account: account, status: 1 }
    })
    // 如果用户不存在
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在,或被禁用')
    }
    const correct = bcryptjs.compareSync(password, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('账号密码错误')
    }
    if (user.type === 16) {
      const { Library } = require('./library')
      const library = await Library.findOne({
        where: {
          admin_id: user.id
        }
      })
      if (library) {
        user.dataValues.library_id = library.id
      } else {
        user.dataValues.library_id = null
      }
    }
    return user
  }

  /**
   * 用户列表(分页) 默认一页15条记录
   * @param offset 跳过多少数据
   * @param type 用户类型
   * @param username 用户名
   * @param status 用户状态
   */
  static async listByPage(offset, type, username, status) {
    let sql = `
    SELECT id,username,account,email,sex,avatar,openid,type,status FROM user
    WHERE type=${type} 
    `
    if (username) {
      sql += `AND username LIKE '%${username}%' `
    }
    if (status) {
      sql += `AND status=${status} `
    }
    sql += `LIMIT 15 OFFSET ${offset}`
    const data = await db.query(sql, { raw: true })
    let user = {}
    user.rows = data[0]
    user.count = data[0].length
    return user
  }

  /**
   * 禁用普通用户账号
   * @param id 用户id
   */
  static async banUser(id) {
    if (id === 1) {
      throw new global.errs.Forbidden('您无权限禁用')
    }
    await User.update({
      status: 0
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 启用普通用户账号
   * @param id 用户id
   */
  static async activateUser(id) {
    await User.update({
      status: 1
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 编辑个人信息
   * @param info 用户信息
   */
  static async modify(info) {
    await User.update({
      ...info
    }, {
      where: {
        id: info.id
      }
    })
  }

  /**
   * 获取个人信息
   * @param id 用户id
   */
  static async detail(id) {
    return await User.findByPk(id)
  }

  /**
   * 重置用户密码
   */
  static async resetPassword(param) {
    return await User.update({
      ...param
    }, {
      where: {
        id: param.id
      }
    })
  }

  /**
   * 获取未分配题库管理员
   */
  static async getUnassignedAdmin() {
    let sql = `
    SELECT u.id,u.username 
    FROM user u 
    LEFT JOIN library l ON u.id=l.admin_id 
    WHERE l.admin_id is NULL 
    AND type=16 
    AND u.status=1 
    `
    const data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
   * 用户删除
   * @param id 用户id
   */
  static async delete(id) {
    const { UserExam } = require('./user_exam')
    const { UserExercise } = require('./user_exercise')
    const { UserLibrary } = require('./user_library')
    const { Announcement } = require('./announcement')
    let funcArr = []
    await db.transaction(async t => {
      funcArr.push(UserExam.destroy({
        where: {
          user_id: id
        },
        force: true
      }, {
        transaction: t
      }))
      funcArr.push(UserExercise.destroy({
        where: {
          user_id: id
        },
        force: true
      }, {
        transaction: t
      }))
      funcArr.push(UserLibrary.destroy({
        where: {
          user_id: id
        },
        force: true
      }, {
        transaction: t
      }))
      funcArr.push(Announcement.destroy({
        where: {
          from: id
        },
        force: true
      }, {
        transaction: t
      }))
      let promise = Promise.all(funcArr)
      return promise.then(() => {
        User.destroy({
          where: {
            id
          },
          force: true
        }, {
          transaction: t
        })
      })
    })
  }

}

User.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户名
  username: Sequelize.STRING(64),
  // 账户
  account: Sequelize.STRING(64),
  // 密码
  password: {
    type: Sequelize.STRING(128),
    // 观察者模式
    set(val) {
      const salt = bcryptjs.genSaltSync(10)
      const hashPassword = bcryptjs.hashSync(val, salt)
      this.setDataValue('password', hashPassword)
    }
  },
  // 用户邮箱
  email: {
    type: Sequelize.STRING(256),
    unique: true,               // 唯一
  },
  // 性别
  sex: Sequelize.INTEGER,
  // 用户头像
  avatar: Sequelize.STRING(255),
  // 第三方id
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  },
  // 角色类型
  type: Sequelize.INTEGER,
  // 账户状态
  status: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user'
})

module.exports = { User }